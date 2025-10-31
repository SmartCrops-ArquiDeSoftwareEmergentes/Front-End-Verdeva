<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const sensorValues = ref([])
const isLoading = ref(true)
const hasError = ref(false)

// Estado para recomendaciones por sensor
const recommendations = ref({})

// Fuente externa proporcionada por el usuario (Beeceptor)
const READINGS_URL = 'https://verdeva-sensors.free.beeceptor.com/api/sensor-readings'

// Usar API real con proxy de Vite como prioridad (evita CORS en dev)
const PRIMARY_API = '/api/gemini/v1/agro/ask'
const ALT_ENDPOINTS = [
  '/api/gemini/ask/v1/agro/ask', // por si el backend espera este patrón
  '/.netlify/functions/gemini-proxy',
  'https://ai-api-pearl-one.vercel.app/v1/agro/ask',
  'https://ai-api-pearl-one.vercel.app/ask/v1/agro/ask',
  'https://ai-api-pearl-one.vercel.app/ask_v1/agro/ask'
]

function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

onMounted(async () => {
  try {
    isLoading.value = true
    hasError.value = false

    const res = await axios.get(READINGS_URL)

    const readings = Array.isArray(res.data) ? res.data : []

    // Agrupar por sensor_id
    const grouped = groupBy(readings, r => r.sensor_id)

    // Construir arreglo para la UI
    sensorValues.value = Object.keys(grouped).map(id => {
      const items = grouped[id].slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      const latest = items[items.length - 1] || null
      return {
        sensor_id: Number(id),
        title: `Sensor ${id}`,
        latest_value: latest ? latest.value : null,
        latest_timestamp: latest ? latest.timestamp : null,
        readings: items.map(r => ({
          id: r.id,
          value: r.value,
          timestamp: r.timestamp,
          created_user: r.created_user
        }))
      }
    }).sort((a, b) => a.sensor_id - b.sensor_id)
  } catch (error) {
    console.error('Error fetching sensor readings:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})

// Función que lanza la petición a la API de recomendaciones
async function askRecommendation(sensor) {
  const id = sensor.sensor_id
  recommendations.value[id] = { loading: true, text: null, error: null }

  // Último valor de la tarjeta
  const lastReadingValue = (sensor.readings && sensor.readings.length)
    ? sensor.readings[sensor.readings.length - 1].value
    : sensor.latest_value

  const temp = !isNaN(Number(lastReadingValue)) ? Number(lastReadingValue) : null
  const lluvia_mm = 0 // valor por defecto si no hay sensor de lluvia

  // Construir la pregunta exactamente como solicitaste
  const question = `¿Recomendaciones de riego para maíz con ${temp !== null ? temp : 'N/A'}°C y ${lluvia_mm} mm de lluvia?`

  const body = {
    question,
    crop: 'maíz',
    location: 'Piura, PE',
    data: { clima: { temp: temp, lluvia_mm } },
    language: 'es'
  }

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
    const headers = { 'Content-Type': 'application/json' }
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

    const endpointsToTry = [PRIMARY_API, ...ALT_ENDPOINTS]
    let res = null
    let lastErr = null

    for (let i = 0; i < endpointsToTry.length; i++) {
      const url = endpointsToTry[i]
      try {
        console.debug(`[askRecommendation] POST ${url}`)
        res = await axios.post(url, body, { headers })
        console.debug('[askRecommendation] status', res?.status)
        break
      } catch (e) {
        lastErr = e
        const status = e?.response?.status
        console.warn(`[askRecommendation] fallo en ${url}:`, status || e.message)
        // Solo seguimos si es 404 - para otros códigos nos detenemos y mostramos error real
        if (status && status !== 404) break
      }
    }

    if (!res) {
      const status = lastErr?.response?.status
      const respBody = lastErr?.response?.data ? JSON.stringify(lastErr.response.data) : null
      const message = status ? `Error ${status}${respBody ? `: ${respBody}` : ''}` : (lastErr?.message || 'No se obtuvo respuesta del servidor')
      throw new Error(message)
    }

    let text = null
    if (res && res.data) {
      text = res.data.answer || res.data.result || res.data.response || res.data.text || JSON.stringify(res.data)
    } else {
      text = 'Respuesta vacía del servidor.'
    }

    recommendations.value[id] = { loading: false, text, error: null }
  } catch (err) {
    console.error('Error fetching recommendation:', err)
    const message = err?.message || (err?.response ? JSON.stringify(err.response.data || err.response) : 'Error al obtener recomendación')
    recommendations.value[id] = { loading: false, text: null, error: message }
  }
}

</script>


<template>
  <div class="sensor-wrapper">
    <h2 class="section-title">Lecturas en tiempo real</h2>

    <div v-if="isLoading" class="loading">
      <span class="loader"></span>
      Cargando datos...
    </div>

    <div v-else-if="hasError" class="error">
      Error al cargar datos. Verifica tu conexión.
    </div>

    <!-- helper funciones expuestos al template -->
    <div v-else class="sensor-grid">
      <div
          v-for="sensor in sensorValues"
          :key="sensor.sensor_id"
          class="sensor-card"
      >
        <div class="card-header">
          <div>
            <p class="sensor-type">{{ sensor.title }}</p>
            <p class="sensor-sub">Último: <strong>{{ sensor.latest_value !== null ? sensor.latest_value : 'Sin datos' }}</strong></p>
            <p class="sensor-sub">{{ sensor.latest_timestamp ? formatDate(sensor.latest_timestamp) : '' }}</p>
          </div>

          <!-- Botón de recomendación por tarjeta -->
          <div>
            <button
              class="rec-btn"
              @click="askRecommendation(sensor)"
              :disabled="recommendations[sensor.sensor_id] && recommendations[sensor.sensor_id].loading"
            >
              <span v-if="recommendations[sensor.sensor_id] && recommendations[sensor.sensor_id].loading">Consultando...</span>
              <span v-else>Recomendación</span>
            </button>
          </div>
        </div>

        <div class="table-wrap">
          <table class="reads-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Value</th>
                <th>Created User</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in sensor.readings" :key="r.id">
                <td>{{ formatDate(r.timestamp) }}</td>
                <td>{{ r.value }}</td>
                <td>{{ r.created_user }}</td>
                <td>{{ r.id }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resultado de la recomendación -->
        <div class="recommendation" v-if="recommendations[sensor.sensor_id] && (recommendations[sensor.sensor_id].text || recommendations[sensor.sensor_id].error)">
          <h4>Recomendación</h4>
          <div v-if="recommendations[sensor.sensor_id].error" class="rec-error">{{ recommendations[sensor.sensor_id].error }}</div>
          <div v-else class="rec-text">{{ recommendations[sensor.sensor_id].text }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// helper funciones expuestos al template
export default {
  methods: {
    formatDate(ts) {
      try {
        const d = new Date(ts)
        return d.toLocaleString()
      } catch (e) {
        return ts
      }
    }
  }
}
</script>

<style scoped>
.sensor-wrapper {
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #024728;
  margin-bottom: 20px;
}
.loading,
.error {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
  font-size: 18px;
}
.loader {
  width: 18px;
  height: 18px;
  border: 3px solid #ccc;
  border-top: 3px solid #024728;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.sensor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.sensor-card {
  background-color: #f1f8f5;
  border-left: 6px solid #024728;
  padding: 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sensor-type {
  font-size: 18px;
  font-weight: bold;
  color: #024728;
  margin: 0 0 6px 0;
}
.sensor-sub {
  margin: 0;
  font-size: 13px;
  color: #333;
}
.table-wrap {
  overflow: auto;
}
.reads-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.reads-table th,
.reads-table td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  text-align: left;
}
.reads-table thead th {
  background: rgba(2,71,40,0.06);
  color: #024728;
  font-weight: 600;
}
/* estilos para el botón de recomendación y el resultado */
.rec-btn {
  background: #024728;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.rec-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.recommendation {
  background: rgba(2,71,40,0.03);
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(2,71,40,0.06);
}
.rec-text {
  color: #024728;
  white-space: pre-wrap;
}
.rec-error {
  color: #b00020;
}
</style>
