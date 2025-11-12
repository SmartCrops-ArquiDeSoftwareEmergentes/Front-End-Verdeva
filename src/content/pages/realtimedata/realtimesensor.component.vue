<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Mapeo de IDs de sensores a nombres legibles
const SENSOR_NAME_MAP = {
  101: 'Temperatura',
  102: 'Humedad',
  103: 'Luz',
  104: 'Lluvia',
  105: 'pH',
  106: 'Nutrientes'
}

// Lecturas y estado UI
const sensorValues = ref([])
const isLoading = ref(true)
const hasError = ref(false)

// Recomendaciones por sensor { [sensor_id]: { loading, answer, recommendation, error } }
const recommendations = ref({})

// Base de API:
// Si hay VITE_AI_API_BASE y es absoluta => usarla.
// En DEV sin variable => usar "/ai-api" (proxy Vite configurado en vite.config.js).
// En PROD sin variable => fallback a despliegue público.
function resolveApiBase() {
  const raw = (import.meta.env.VITE_AI_API_BASE || '').trim()
  if (raw && /^https?:\/\//i.test(raw)) return raw.replace(/\/$/, '')
  // Por defecto, usar path relativo para aprovechar proxy (dev) y redirect (prod)
  return '/ai-api'
}
const API_BASE = resolveApiBase()
const AGRO_ENDPOINT = `${API_BASE.replace(/\/$/, '')}/v1/agro/ask`
console.debug('[AI-API] USING ENDPOINT:', AGRO_ENDPOINT)

// Fuente de lecturas simuladas
const READINGS_URL = 'https://verdeva-sensors.free.beeceptor.com/api/sensor-readings'

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
    const grouped = groupBy(readings, r => r.sensor_id)
    sensorValues.value = Object.keys(grouped).map(id => {
      const items = grouped[id].slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      const latest = items[items.length - 1] || null
      return {
        sensor_id: Number(id),
        title: SENSOR_NAME_MAP[id] || `Sensor ${id}`,
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

function inferParameter(sensor) {
  switch (sensor.sensor_id) {
    case 101: return { parameter: 'temperatura_aire', unit: '°C' }
    case 102: return { parameter: 'humedad_suelo', unit: '%' }
    case 103: return { parameter: 'luz', unit: 'lux' }
    case 104: return { parameter: 'lluvia', unit: 'mm' }
    case 105: return { parameter: 'ph_suelo', unit: 'pH' }
    case 106: return { parameter: 'nutrientes', unit: 'ppm' }
    default: return { parameter: 'humedad_suelo', unit: '%' }
  }
}

function buildPayload(sensor) {
  const lastReading = (sensor.readings && sensor.readings.length) ? sensor.readings[sensor.readings.length - 1] : null
  const valueRaw = lastReading ? lastReading.value : sensor.latest_value
  const valueNum = !isNaN(Number(valueRaw)) ? Number(valueRaw) : null
  const { parameter, unit } = inferParameter(sensor)
  if (valueNum !== null) {
    return {
      question: `Último valor: ${valueNum}${unit ? ' ' + unit : ''}`,
      crop: 'maíz',
      stage: 'vegetativo',
      parameter,
      value: valueNum,
      unit,
      safe_mode: true,
      length: 'short'
    }
  }
  return {
    question: `Consulta educativa sobre ${parameter}`,
    crop: 'maíz',
    stage: 'vegetativo',
    safe_mode: true,
    length: 'short'
  }
}

function extractAnswer(data) {
  if (!data) return 'Respuesta vacía.'
  if (typeof data === 'string') return data
  return data.answer || data.text || JSON.stringify(data)
}

async function askRecommendation(sensor) {
  const id = sensor.sensor_id
  recommendations.value[id] = { loading: true, answer: null, recommendation: null, error: null }
  const payload = buildPayload(sensor)
  try {
    console.debug('[askRecommendation] POST', AGRO_ENDPOINT, payload)
    const res = await axios.post(AGRO_ENDPOINT, payload, { headers: { 'Content-Type': 'application/json' } })
    if (!res || !res.data) throw new Error('Respuesta vacía del servidor')
    if (typeof res.data === 'string' && /<!DOCTYPE html>/i.test(res.data)) {
      throw new Error('Respuesta HTML inesperada (¿404?). Revisa el proxy o la URL base.')
    }
    const answer = extractAnswer(res.data)
    const recommendation = res.data.recommendation || null
    recommendations.value[id] = { loading: false, answer, recommendation, error: null }
  } catch (err) {
    const status = err?.response?.status
    let msg = err?.message || 'Error desconocido'
    const detail = err?.response?.data?.detail
    if (detail) msg = detail
    if (status) msg = `Error ${status}: ${msg}`
    console.error('[askRecommendation] error:', err)
    recommendations.value[id] = { loading: false, answer: null, recommendation: null, error: msg }
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
    <div v-else-if="hasError" class="error">Error al cargar datos. Verifica tu conexión.</div>

    <div v-else class="sensor-grid">
      <div v-for="sensor in sensorValues" :key="sensor.sensor_id" class="sensor-card">
        <div class="card-header">
          <div>
            <p class="sensor-type">{{ sensor.title }}</p>
            <p class="sensor-sub">Último: <strong>{{ sensor.latest_value !== null ? sensor.latest_value : 'Sin datos' }}</strong></p>
            <p class="sensor-sub">{{ sensor.latest_timestamp ? formatDate(sensor.latest_timestamp) : '' }}</p>
          </div>
          <div>
            <button class="rec-btn" @click="askRecommendation(sensor)" :disabled="recommendations[sensor.sensor_id]?.loading">
              <span v-if="recommendations[sensor.sensor_id]?.loading">Consultando...</span>
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

        <div class="recommendation" v-if="recommendations[sensor.sensor_id] && (recommendations[sensor.sensor_id].answer || recommendations[sensor.sensor_id].error)">
          <h4>Recomendación</h4>
          <div v-if="recommendations[sensor.sensor_id].error" class="rec-error">{{ recommendations[sensor.sensor_id].error }}</div>
          <template v-else>
            <div class="answer-text">{{ recommendations[sensor.sensor_id].answer }}</div>
            <div v-if="recommendations[sensor.sensor_id].recommendation" class="structured-rec">
              <div class="action-chip" :class="recommendations[sensor.sensor_id].recommendation.action">
                {{ recommendations[sensor.sensor_id].recommendation.action }}
              </div>
              <div class="rec-row">Parámetro: <strong>{{ recommendations[sensor.sensor_id].recommendation.parameter }}</strong></div>
              <div class="rec-row" v-if="recommendations[sensor.sensor_id].recommendation.target_range">
                <template v-if="recommendations[sensor.sensor_id].recommendation.target_range.min !== null && recommendations[sensor.sensor_id].recommendation.target_range.max !== null">
                  Rango objetivo: {{ recommendations[sensor.sensor_id].recommendation.target_range.min }}–{{ recommendations[sensor.sensor_id].recommendation.target_range.max }} {{ recommendations[sensor.sensor_id].recommendation.target_range.unit }}
                </template>
                <template v-else>Sin rango numérico específico.</template>
              </div>
              <div class="rec-row" v-if="recommendations[sensor.sensor_id].recommendation.rationale">
                <em>{{ recommendations[sensor.sensor_id].recommendation.rationale }}</em>
              </div>
              <ul class="warnings" v-if="recommendations[sensor.sensor_id].recommendation.warnings?.length">
                <li v-for="(w,i) in recommendations[sensor.sensor_id].recommendation.warnings" :key="i">⚠ {{ w }}</li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    formatDate(ts) {
      try { return new Date(ts).toLocaleString() } catch { return ts }
    }
  }
}
</script>

<style scoped>
.sensor-wrapper { padding: 20px; font-family: 'Roboto', sans-serif; }
.section-title { font-size: 24px; font-weight: 700; color: #024728; margin-bottom: 20px; }
.loading, .error { display: flex; align-items: center; gap: 10px; color: #555; font-size: 18px; }
.loader { width: 18px; height: 18px; border: 3px solid #ccc; border-top: 3px solid #024728; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.sensor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.sensor-card { background-color: #f1f8f5; border-left: 6px solid #024728; padding: 16px; border-radius: 10px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.sensor-type { font-size: 18px; font-weight: bold; color: #024728; margin: 0 0 6px 0; }
.sensor-sub { margin: 0; font-size: 13px; color: #333; }
.table-wrap { overflow: auto; }
.reads-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.reads-table th, .reads-table td { padding: 8px 10px; border-bottom: 1px solid rgba(0,0,0,0.06); text-align: left; }
.reads-table thead th { background: rgba(2,71,40,0.06); color: #024728; font-weight: 600; }
.rec-btn { background: #024728; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; }
.rec-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
.recommendation { background: rgba(2,71,40,0.03); padding: 10px; border-radius: 6px; border: 1px solid rgba(2,71,40,0.06); }
.answer-text { color: #024728; white-space: pre-wrap; margin-bottom: 6px; }
.rec-error { color: #b00020; }
.structured-rec { display: flex; flex-direction: column; gap: 4px; }
.action-chip { display: inline-block; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
.action-chip.aumentar { background: #1e88e5; }
.action-chip.disminuir { background: #e53935; }
.action-chip.mantener { background: #43a047; }
.rec-row { font-size: 13px; }
.warnings { margin: 4px 0 0; padding-left: 16px; font-size: 12px; color: #b54d00; }
.warnings li { list-style: none; }
</style>
