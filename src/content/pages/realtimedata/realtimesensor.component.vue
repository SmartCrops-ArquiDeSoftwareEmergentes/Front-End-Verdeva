<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const sensorValues = ref([])
const isLoading = ref(true)
const hasError = ref(false)

const jwt = localStorage.getItem('jwt_token')
const username = localStorage.getItem('username')

const BASE_URL =
    import.meta.env.MODE === 'development'
        ? '/api'
        : 'https://verdeva-ayagdeb0dceddwgw.canadacentral-01.azurewebsites.net'

onMounted(async () => {
  if (!jwt || !username) {
    console.error('JWT o username no están disponibles en localStorage')
    hasError.value = true
    isLoading.value = false
    return
  }

  try {
    console.log('🌐 Realizando petición con JWT:', jwt)
    console.log('👤 Usuario:', username)

    const headers = {
      Authorization: `Bearer ${jwt}`
    }

    const userUrl = `${BASE_URL}/api/Device/sensors/by-user/${encodeURIComponent(username)}`
    const sensorRes = await axios.get(userUrl, { headers })

    const sensors = sensorRes.data
    console.log('🔧 Sensores encontrados:', sensors.length)

    const promises = sensors.map(async (sensor) => {
      try {
        const readingsUrl = `${BASE_URL}/api/Device/sensors/${sensor.id}/readings`
        const readingRes = await axios.get(readingsUrl, { headers })
        const latest = readingRes.data.at(-1)
        return {
          type: sensor.type,
          value: latest ? `${latest.value} ${sensor.unitOfMeasurement}` : 'Sin datos'
        }
      } catch (innerErr) {
        console.warn(`⚠️ Error al obtener lectura para sensor ${sensor.id}:`, innerErr)
        return {
          type: sensor.type,
          value: 'Error al leer'
        }
      }
    })

    sensorValues.value = await Promise.all(promises)
  } catch (error) {
    console.error('❌ Error obteniendo sensores:', error)
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
      Error al cargar datos. Verifica tu conexión o autenticación.
    </div>

    <div v-else class="sensor-list">
      <div
          v-for="(sensor, index) in sensorValues"
          :key="index"
          class="sensor-card"
      >
        <p class="sensor-type">{{ sensor.type }}</p>
        <p class="sensor-value">{{ sensor.value }}</p>
      </div>
    </div>
  </div>
</template>

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
.sensor-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sensor-card {
  background-color: #f1f8f5;
  border-left: 6px solid #024728;
  padding: 16px;
  border-radius: 10px;
}
.sensor-type {
  font-size: 18px;
  font-weight: bold;
  color: #024728;
}
.sensor-value {
  font-size: 16px;
  color: #333;
}
</style>
