<template>
  <div class="individual-crop">
    <button class="btn-return" @click="goBack">
      <img src="/general-icons/return-icon.png" alt="Regresar"/>
    </button>
    <div class="top-section">
      <div class="cultivation-card">
        <h3 class="cultivation-title">{{ selectedCrop.name }}</h3>
        <img src="/recommendations/cultivo-papa.jpg" alt="Cultivo de Papas" class="cultivation-img"/>
        <p>Fecha de siembra: {{ selectedCrop.date }}</p>
        <p>Días desde siembra: {{ selectedCrop.days }} días</p>
        <p>Etapa de crecimiento: {{ selectedCrop.stage }}</p>
        <p>Estado: {{ selectedCrop.state }}</p>
        <p>Cantidad: {{ selectedCrop.quantity }}</p>
      </div>
      <div class="indicators-card">
        <h3 class="indicators-title">Indicadores</h3>
        <p>Humedad de suelo: 60°</p>
        <p>Temperatura ambiente: 54°</p>
        <p>Temperatura del Suelo: 50°</p>
        <p>Nivel de Nutrientes: Saludable</p>
        <p>pH del Suelo: 1 Tonelada</p>
        <p>Horas de sol recibidas: 1 Tonelada</p>
        <p>Radiación Solar: 50%</p>
      </div>
    </div>
    <h3 class="sub-title">Dispositivos IoT:</h3>
    <div class="iot-list">
      <div v-for="device in devices" :key="device.id" class="iot-card">
        <img src="/general-icons/iot-icon.png" alt="IoT" class="iot-icon"/>
        <h4 class="iot-title">{{ device.name }}</h4>
        <p>Código: {{ device.code }}</p>
        <p>
          Estado:
          <input type="checkbox" v-model="device.state"/>
        </p>
        <p>
          Alertas:
          <input type="checkbox" v-model="device.alerts"/>
        </p>
      </div>
      <button class="add-button" @click="goToAddDevice">
        <img src="/general-icons/add-icon.png" alt="Agregar"/>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const devices = ref([
  { id: 1, name: 'Sensor de Humedad', code: 'US123-01', state: true, alerts: false },
  { id: 2, name: 'Actuador de Riego', code: 'US123-23', state: true, alerts: true }
])

const cropId = parseInt(route.params.id, 10);

const storedCrops = localStorage.getItem('cultivos');
const crops = storedCrops ? JSON.parse(storedCrops) : [];

const selectedCrop = ref(crops.find(crop => crop.id === cropId) || {});

if (!selectedCrop.value) {
  console.error(`No se encontró un cultivo con el ID: ${cropId}`);
}

const goBack = () => router.push('/crops')
const goToAddDevice = () => {}
</script>

<style scoped>
.individual-crop {
  position: relative;
  padding: 30px;
}
.btn-return {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 50px;
  height: 50px;
  background-color: #004225;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.btn-return img {
  width: 20px;
  height: 20px;
}
.top-section {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
}
.cultivation-card,
.indicators-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 320px;
  padding: 16px;
}
.cultivation-title,
.indicators-title {
  font-size: 18px;
  color: #004225;
  margin-bottom: 12px;
}
.cultivation-img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}
.cultivation-card p,
.indicators-card p {
  font-size: 14px;
  color: #333;
  margin: 4px 0;
}
.sub-title {
  font-size: 18px;
  color: #004225;
  margin-bottom: 12px;
}
.iot-list {
  display: flex;
  gap: 20px;
  align-items: center;
}
.iot-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 260px;
  padding: 12px;
  text-align: center;
}
.iot-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}
.iot-title {
  font-size: 14px;
  color: #004225;
  margin-bottom: 8px;
}
.iot-card p {
  font-size: 12px;
  color: #333;
  margin: 4px 0;
}
.add-button {
  width: 56px;
  height: 56px;
  background-color: #004225;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.add-button img {
  width: 24px;
  height: 24px;
}
</style>
