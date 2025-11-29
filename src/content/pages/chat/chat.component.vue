<template>
  <div class="chat-page">
    <div class="chat-header">
      <h1>💬 Asistente Agrícola IA</h1>
      <p>Consulta información sobre tus cultivos en tiempo real</p>
    </div>

    <div class="chat-container">
      <!-- Controls -->
      <div class="controls">
        <div class="control-group">
          <label for="crop-select">🌱 Cultivo:</label>
          <select id="crop-select" v-model="crop" class="select-control">
            <option value="">Seleccionar cultivo...</option>
            <option v-for="c in crops" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div class="control-group">
          <label for="stage-select">📊 Etapa del cultivo:</label>
          <select id="stage-select" v-model="stage" class="select-control">
            <option value="">Seleccionar etapa...</option>
            <option v-for="s in stages" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-if="messages.length === 0" class="empty-state">
          <div class="empty-icon">🌾</div>
          <p>¡Hola! Soy tu asistente agrícola.</p>
          <p>Pregunta lo que necesites sobre tus cultivos.</p>
        </div>

        <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.tipo]">
          <div class="message-header">
            <span class="message-icon">{{ msg.tipo === 'pregunta' ? '👨‍🌾' : '🤖' }}</span>
            <small class="message-time">{{ formatTime(msg.timestamp) }}</small>
          </div>
          <div class="message-content" v-html="formatMessage(msg.texto)"></div>
        </div>

        <div v-if="loading" class="message respuesta loading-message">
          <div class="message-header">
            <span class="message-icon">🤖</span>
            <small>Pensando...</small>
          </div>
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Input Form -->
      <form class="chat-input-form" @submit.prevent="sendMessage">
        <div class="input-wrapper">
          <textarea
            v-model="question"
            placeholder="Escribe tu pregunta aquí... Ej: ¿Cómo regar el tomate?"
            rows="2"
            @keydown.enter.exact.prevent="sendMessage"
            :disabled="loading"
            ref="inputTextarea"
          ></textarea>

          <div class="input-actions">
            <select v-model="length" class="length-select" title="Longitud de respuesta">
              <option value="short">📝 Corta</option>
              <option value="medium">📄 Mediana</option>
            </select>

            <button type="submit" :disabled="loading || !question.trim()" class="send-btn">
              <span v-if="!loading">📤 Enviar</span>
              <span v-else>⏳ Enviando...</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import axios from 'axios'

const question = ref('')
const crop = ref('')
const stage = ref('')
const length = ref('medium')
const loading = ref(false)
const messages = ref([])
const messagesContainer = ref(null)
const inputTextarea = ref(null)

// Opciones de cultivos
const crops = [
  'Tomate',
  'Maíz',
  'Lechuga',
  'Fresa',
  'Arroz',
  'Papa',
  'Zanahoria',
  'Cebolla',
  'Pimiento',
  'Pepino'
]

// Opciones de etapas (lenguaje de agricultor)
const stages = [
  { value: 'germinacion', label: 'Germinación / Siembra' },
  { value: 'plantula', label: 'Plántula / Almácigo' },
  { value: 'crecimiento', label: 'Crecimiento / Desarrollo' },
  { value: 'vegetativo', label: 'Vegetativo' },
  { value: 'floracion', label: 'Floración' },
  { value: 'fructificacion', label: 'Fructificación / Formación de fruto' },
  { value: 'maduracion', label: 'Maduración' },
  { value: 'cosecha', label: 'Cosecha' }
]

// API Base - usa proxy /ai-api en producción (Netlify)
const API_BASE = import.meta.env.VITE_API_URL || '/ai-api'

async function sendMessage() {
  const questionText = question.value.trim()
  if (!questionText || loading.value) return

  loading.value = true

  // Agregar pregunta al chat
  messages.value.push({
    tipo: 'pregunta',
    texto: questionText,
    timestamp: Date.now()
  })

  // Limpiar input
  question.value = ''
  await nextTick()
  scrollToBottom()

  try {
    const payload = {
      question: questionText,
      length: length.value
    }

    if (crop.value) payload.crop = crop.value.toLowerCase()
    if (stage.value) payload.stage = stage.value

    console.log('[Chat] Enviando:', payload)

    const { data } = await axios.post(`${API_BASE}/v1/agro/chat`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 45000
    })

    console.log('[Chat] Respuesta recibida:', data)

    // Agregar respuesta al chat
    messages.value.push({
      tipo: 'respuesta',
      texto: data.answer || 'Sin respuesta',
      timestamp: Date.now()
    })

    await nextTick()
    scrollToBottom()

    // Focus de nuevo en el textarea
    inputTextarea.value?.focus()

  } catch (err) {
    console.error('[Chat] Error:', err)

    let errorMsg = 'Lo siento, hubo un error al procesar tu pregunta.'

    if (err.response) {
      errorMsg = err.response.data?.detail || `Error ${err.response.status}: ${err.response.statusText}`
    } else if (err.message === 'Network Error') {
      errorMsg = 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    } else if (err.code === 'ECONNABORTED') {
      errorMsg = 'La solicitud tardó demasiado. Intenta con una pregunta más corta.'
    }

    messages.value.push({
      tipo: 'respuesta',
      texto: `⚠️ ${errorMsg}`,
      timestamp: Date.now()
    })

    await nextTick()
    scrollToBottom()
  } finally {
    loading.value = false
  }
}

function formatMessage(text) {
  if (!text) return ''

  const lines = String(text).split('\n')
  let html = ''
  let inList = false

  lines.forEach((ln) => {
    const l = ln.trim()

    if (!l) {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      html += '<br>'
      return
    }

    // Detectar bullets
    if (l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) {
      if (!inList) {
        html += '<ul>'
        inList = true
      }
      const content = l.substring(1).trim()
      html += `<li>${escapeHtml(content)}</li>`
    } else {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      html += `<p>${escapeHtml(l)}</p>`
    }
  })

  if (inList) html += '</ul>'
  return html
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  inputTextarea.value?.focus()
})
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.chat-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chat-header h1 {
  font-size: 2.5rem;
  color: var(--verde-oscuro, #2d5016);
  margin-bottom: 0.5rem;
}

.chat-header p {
  font-size: 1.1rem;
  color: #666;
}

.chat-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
}

.controls {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.control-group {
  flex: 1;
  min-width: 200px;
}

.control-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.select-control {
  width: 100%;
  padding: 0.7rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.select-control:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f9fafb;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.message {
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.message-icon {
  font-size: 1.5rem;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.message-content {
  padding: 1rem 1.2rem;
  border-radius: 12px;
  line-height: 1.6;
  max-width: 85%;
}

.message.pregunta .message-header {
  justify-content: flex-end;
}

.message.pregunta .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message.respuesta .message-content {
  background: white;
  border: 2px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.message-content :deep(p) {
  margin: 0.5rem 0;
}

.message-content :deep(ul) {
  margin: 0.8rem 0;
  padding-left: 1.5rem;
}

.message-content :deep(li) {
  margin: 0.4rem 0;
}

.loading-message .message-content {
  padding: 1rem;
}

.loading-dots {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input-form {
  padding: 1.5rem;
  background: white;
  border-top: 2px solid #e5e7eb;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.input-wrapper textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  transition: border-color 0.3s;
}

.input-wrapper textarea:focus {
  outline: none;
  border-color: #667eea;
}

.input-wrapper textarea:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.input-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.length-select {
  padding: 0.6rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  background: white;
}

.send-btn {
  flex: 1;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .chat-page {
    padding: 1rem;
  }

  .chat-header h1 {
    font-size: 1.8rem;
  }

  .chat-container {
    height: calc(100vh - 150px);
  }

  .controls {
    flex-direction: column;
  }

  .control-group {
    min-width: 100%;
  }

  .message-content {
    max-width: 95%;
  }

  .input-actions {
    flex-direction: column;
  }

  .length-select {
    width: 100%;
  }
}
</style>

