<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const storedUsername = localStorage.getItem('username') || 'Usuario'

const dashboard = reactive({
  usuario: {
    username: storedUsername,
    creacionCuenta: '2023-10-01',
    suscripcion: 'ESTÁNDAR',
    correoElectronico: `${storedUsername}@nutricontrol.com`
  },
  camposAgricolas: { activos: 5, inactivos: 1 },
  aguaAhorrada: { lunes: 5, martes: 3, miercoles: 6, jueves: 8, viernes: 4, sabado: 2, domingo: 3 },
  dispositivosIoT: 8,
  totalCultivos: 10,
  calendario: { mes: 'Mayo', anio: 2025, diaActual: 9 },
  recomendacionDelDia: 'Activa el actuador de Riego ahora mismo',
  crecimientoCultivos: [
    { nombre: 'Tomate', porcentaje: 30 },
    { nombre: 'Lechuga', porcentaje: 21 },
    { nombre: 'Mango', porcentaje: 25 },
    { nombre: 'Pera', porcentaje: 21 },
    { nombre: 'Platano', porcentaje: 10 },
    { nombre: 'Yuca', porcentaje: 20 },
    { nombre: 'Uva', porcentaje: 8 }
  ]
})

const doughnutRef = ref(null)
const barRef = ref(null)
const growthRef = ref(null)

onMounted(() => {
  new Chart(doughnutRef.value, {
    type: 'doughnut',
    data: {
      labels: ['Activos', 'Inactivos'],
      datasets: [{
        data: [dashboard.camposAgricolas.activos, dashboard.camposAgricolas.inactivos],
        backgroundColor: ['#014728', '#9C7A36']
      }]
    },
    options: { plugins: { legend: { display: false } } }
  })

  const datos = dashboard.aguaAhorrada
  new Chart(barRef.value, {
    type: 'bar',
    data: {
      labels: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
      datasets: [{
        data: [datos.lunes, datos.martes, datos.miercoles, datos.jueves, datos.viernes, datos.sabado, datos.domingo],
        backgroundColor: ['#014728','#014728','#014728','#9C7A36','#014728','#014728','#014728']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
  })

  new Chart(growthRef.value, {
    type: 'bar',
    data: {
      labels: dashboard.crecimientoCultivos.map(c => c.nombre),
      datasets: [{
        data: dashboard.crecimientoCultivos.map(c => c.porcentaje),
        backgroundColor: dashboard.crecimientoCultivos.map((_, i) => i % 2 ? '#014728' : '#9C7A36')
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
  })
})

const calendarWeeks = computed(() => {
  const m = dashboard.calendario.mes
  const y = dashboard.calendario.anio
  const monthIndex = new Date(`${m} 1, ${y}`).getMonth()
  const days = new Date(y, monthIndex + 1, 0).getDate()
  const firstDay = new Date(y, monthIndex, 1).getDay()
  const weeks = []
  let week = Array(firstDay).fill('')
  for (let d = 1; d <= days; d++) {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill('')])
  return weeks
})
</script>

<template>
  <div class="home-container">
    <div class="dashboard">
      <div class="header">
        <h2>Bienvenido a Verdeva, <span class="user-name">{{ dashboard.usuario.username }}</span></h2>
      </div>

      <div class="cards-grid">
        <div class="card card-campos">
          <h3>Campos Agrícolas</h3>
          <canvas ref="doughnutRef" class="doughnut-chart"></canvas>
          <div class="legend">
            <span><span class="dot activos"></span> Campos Activos {{ dashboard.camposAgricolas.activos }}</span>
            <span><span class="dot inactivos"></span> Campos Inactivos {{ dashboard.camposAgricolas.inactivos }}</span>
          </div>
        </div>

        <div class="card card-agua">
          <h3>Agua ahorrada (Litros)</h3>
          <canvas ref="barRef" class="bar-chart"></canvas>
        </div>

        <div class="card card-iot">
          <img src="/general-icons/iot-icon.png" alt="IoT">
          <div>
            <span>Dispositivos IoT:</span>
            <span class="value">{{ dashboard.dispositivosIoT }}</span>
          </div>
        </div>

        <div class="card card-total">
          <img src="/general-icons/total-crops-icon.png" alt="Cultivos">
          <div>
            <span>Total de Cultivos:</span>
            <span class="value">{{ dashboard.totalCultivos }}</span>
          </div>
        </div>

        <div class="card card-calendario">
          <h3>{{ dashboard.calendario.mes }} {{ dashboard.calendario.anio }}</h3>
          <table class="calendar">
            <thead>
            <tr><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th></tr>
            </thead>
            <tbody>
            <tr v-for="(week,i) in calendarWeeks" :key="i">
              <td v-for="(day,j) in week" :key="j" :class="{ today: day === dashboard.calendario.diaActual }">{{ day }}</td>
            </tr>
            </tbody>
          </table>
          <div class="recomendation">• {{ dashboard.recomendacionDelDia }}</div>
        </div>

        <div class="card card-crecimiento">
          <h3>Crecimiento de cultivos</h3>
          <canvas ref="growthRef" class="growth-chart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.home-container {
  --primary: #014728;
  --secondary: #9C7A36;
  --card-bg: #fff;
  --card-shadow: rgba(0, 0, 0, 0.1);
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
}
.dashboard {
  font-family: 'Roboto', sans-serif;
  color: #333;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  margin-bottom: 20px;
}
.header h2:first-child {
  font-size: 24px;
  font-weight: 500;
}
.header .user-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--secondary);
}
.cards-grid {
  display: grid;
  grid-template-areas:
    "campos agua iot"
    "total calendario crecimiento";
  grid-template-columns: 380px 1fr 480px;
  grid-template-rows: 400px 350px;
  gap: 20px;
}
@media (max-width: 1024px) {
  .cards-grid {
    grid-template-areas:
      "campos"
      "agua"
      "iot"
      "total"
      "calendario"
      "crecimiento";
    grid-template-columns: 1fr;
  }
}
.card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px var(--card-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px var(--card-shadow);
}
.card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--primary);
}
.card-campos {
  grid-area: campos;
}
.card-campos .doughnut-chart {
  width: 260px !important;
  height: 260px !important;
  max-width: 260px;
  max-height: 260px;
}
.card-agua {
  grid-area: agua;
}
.card-agua .bar-chart {
  width:85% !important;
  height: 280px !important;
  max-height: 280px;
}
.card-iot {
  grid-area: iot;
  justify-content: center;
  gap: 15px;
}
.card-iot img {
  width: 80px;
  height: 80px;
}
.card-iot div {
  text-align: center;
}
.card-iot span:first-child {
  font-size: 22px;
  font-weight: 600;
}
.card-iot .value {
  font-size: 52px;
  font-weight: 700;
  color: var(--primary);
  display: block;
  margin-top: 8px;
}
.card-total {
  grid-area: total;
  justify-content: center;
  gap: 15px;
}
.card-total img {
  width: 80px;
  height: 80px;
}
.card-total div {
  text-align: center;
}
.card-total span:first-child {
  font-size: 22px;
  font-weight: 600;
}
.card-total .value {
  font-size: 52px;
  font-weight: 700;
  color: var(--primary);
  display: block;
  margin-top: 8px;
}
.card-calendario {
  grid-area: calendario;
  align-items: stretch;
}
.card-calendario .calendar {
  width: 80%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}
.card-calendario th {
  background: #f9f9f9;
  font-weight: 500;
  padding: 8px 0;
  font-size: 12px;
}
.card-calendario td {
  padding: 8px 0;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}
.card-calendario tr:last-child td {
  border-bottom: none;
}
.card-calendario td.today {
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
}
.card-calendario .recomendation {
  font-size: 14px;
  color: var(--primary);
}
.card-crecimiento {
  grid-area: crecimiento;
}
.card-crecimiento .growth-chart {
  width: 100% !important;
  height: 280px !important;
  max-height: 280px;
}
.legend {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 14px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}
.dot.activos {
  background: var(--primary);
}
.dot.inactivos {
  background: var(--secondary);
}
</style>
