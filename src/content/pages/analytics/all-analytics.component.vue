<script setup>
import { reactive } from 'vue'

const analytics = reactive({
  fecha: '09/05/2025',
  cultivos: [
    {
      nombre: 'Cultivos de Papas',
      img: 'recommendations/cultivo-papa.jpg',
      estimaciones: [
        'Consumo proyectado de agua: 12,500 litros por hectárea restante',
        'Producción esperada: 3.8 toneladas por hectárea'
      ],
      riesgos: [
        'Riesgo climático: Alta probabilidad de heladas en las próximas 2 semanas'
      ],
      prediccion:
          'Si se mantienen las condiciones actuales de humedad y temperatura, se espera un rendimiento final de entre 3.5 y 4 toneladas por hectárea.'
    },
    {
      nombre: 'Cultivos de Camote',
      img: 'recommendations/cultivo-camote.jpg',
      estimaciones: [
        'Consumo proyectado de agua: 12,500 litros por hectárea restante',
        'Producción esperada: 3.8 toneladas por hectárea'
      ],
      riesgos: [
        'Riesgo climático: Alta probabilidad de heladas en las próximas 2 semanas'
      ],
      prediccion:
          'Si se mantienen las condiciones actuales de humedad y temperatura, se espera un rendimiento final de entre 3.5 y 4 toneladas por hectárea.'
    }
  ]
})
</script>

<template>
  <div class="analytics-container">
    <h2 class="title">
      Análisis Predictito de tus<br />
      <span class="highlight">Cultivos</span>
    </h2>
    <div class="cards-list">
      <div
          v-for="cultivo in analytics.cultivos"
          :key="cultivo.nombre"
          class="card-analytics"
      >
        <h3 class="card-title">{{ cultivo.nombre }}</h3>
        <div class="card-content">
          <img :src="cultivo.img" :alt="cultivo.nombre" />
          <div class="details">
            <div class="section">
              <span class="section-title">Estimaciones:</span>
              <ul>
                <li v-for="(e,i) in cultivo.estimaciones" :key="i">{{ e }}</li>
              </ul>
            </div>
            <div class="section">
              <span class="section-title">Riesgos:</span>
              <ul>
                <li v-for="(r,i) in cultivo.riesgos" :key="i">{{ r }}</li>
              </ul>
            </div>
            <div class="section">
              <span class="section-title">Predicción:</span>
              <ul>
                <li>{{ cultivo.prediccion }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: sans-serif;
}
.title {
  font-size: 32px;
  color: #014728;
  text-align: left;
  margin-bottom: 30px;
  line-height: 1.2;
}
.highlight {
  color: #9C7A36;
}
.cards-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.card-analytics {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.card-title {
  font-size: 30px;
  color: #014728;
  margin-bottom: 16px;
}
.card-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  font-size: 15px;
}
.card-content img {
  width: 300px;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
}
.details {
  flex: 1;
}
.section {
  margin-bottom: 16px;
}
.section-title {
  font-weight: bold;
  color: #014728;
}
.section ul {
  list-style: disc;
  padding-left: 20px;
  margin: 8px 0 0;
}
.section ul li {
  margin-bottom: 8px;
}
</style>
