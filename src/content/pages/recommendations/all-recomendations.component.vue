<script setup>
import { reactive } from 'vue'

const recommendations = reactive({
  fecha: '09/05/2025',
  cultivos: [
    {
      nombre: 'Cultivos de Papas',
      img: 'recommendations/cultivo-papa.jpg',
      items: [
        'Activar riego por goteo si la humedad del suelo está por debajo del 60%',
        'Ajustar pH del suelo si es menor a 5.5',
        'Aplicar control preventivo contra tizón tardío si la humedad relativa es alta (>85%)'
      ]
    },
    {
      nombre: 'Cultivos de Yuca',
      img: 'recommendations/cultivo-yuca.jpg',
      items: [
        'Evitar exceso de riego si hay lluvias acumuladas',
        'Verificar niveles de potasio durante fase de engrosamiento de raíces',
        'Realizar deshierbe cada 20 días'
      ]
    }
  ]
})
</script>

<template>
  <div class="recommendations-container">
    <div class="header">
      <h2>Recomendaciones para tus <span class="highlight">Cultivos</span></h2>
      <div class="date">Fecha: {{ recommendations.fecha }}</div>
    </div>
    <div class="cards-grid">
      <div v-for="c in recommendations.cultivos" :key="c.nombre" class="card">
        <h3>{{ c.nombre }}</h3>
        <div class="card-content">
          <img :src="c.img" :alt="c.nombre" />
          <ul>
            <li v-for="(it, i) in c.items" :key="i">{{ it }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommendations-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: sans-serif;
}
.header h2 {
  font-size: 32px;
  color: #014728;
  margin: 0 0 8px;
}
.header .highlight {
  color: #9C7A36;
}
.header .date {
  font-size: 18px;
  color: #014728;
  margin-bottom: 24px;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.card h3 {
  font-size: 20px;
  color: #014728;
  margin-bottom: 16px;
}
.card-content {
  display: flex;
  gap: 16px;
}
.card-content img {
  width: 120px;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
}
.card-content ul {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  flex: 1;
}
.card-content li {
  margin-bottom: 8px;
  color: #014728;
  line-height: 1.4;
}
</style>
