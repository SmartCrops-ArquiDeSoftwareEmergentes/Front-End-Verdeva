<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const sensorValues = ref([])
const isLoading = ref(true)
const hasError = ref(false)

// Fuente externa proporcionada por el usuario (Beeceptor)
const READINGS_URL = 'https://verdeva-sensor.free.beeceptor.com/api/sensor-readings'

function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

function formatTimestamp(ts) {
  try {
    const d = new Date(ts)
    return d.toLocaleString()
  } catch (e) {
    return ts
  }
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

    <div v-else class="sensor-grid">
      <div
          v-for="(sensor, index) in sensorValues"
          :key="sensor.sensor_id"
          class="sensor-card"
      >
        <div class="card-header">
          <div>
            <p class="sensor-type">{{ sensor.title }}</p>
            <p class="sensor-sub">Último: <strong>{{ sensor.latest_value !== null ? sensor.latest_value : 'Sin datos' }}</strong></p>
            <p class="sensor-sub">{{ sensor.latest_timestamp ? formatDate(sensor.latest_timestamp) : '' }}</p>
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
      </div>
    </div>

  </div>
</template>

<script>
// helper functions expuestos al template
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
</style>
