<script setup>
import { reactive, computed } from 'vue'

const dashboard = reactive({
  usuario: { suscripcion: 'ESTÁNDAR' }
})

const currentPlan = computed(() => {
  const s = dashboard.usuario.suscripcion.toLowerCase()
  return s.charAt(0).toUpperCase() + s.slice(1)
})

const plans = [
  {
    tipo: 'Estándar',
    fechaInicio: '01/02/2025',
    fechaFin: '02/03/2025',
    features: [
      'Campos Agrícolas ilimitados',
      'Gestión ilimitada',
      'Recomendaciones continuas',
      'Registro histórico'
    ]
  },
  {
    tipo: 'Premium',
    features: [
      'Campos Agrícolas ilimitados',
      'Gestión ilimitada',
      'Recomendaciones continuas',
      'Registro histórico',
      'Análisis Predictivo'
    ]
  },
  {
    tipo: 'Básica',
    features: [
      'Campos Agrícolas limitados',
      'Gestión limitada',
      'Recomendaciones continuas'
    ]
  }
]
</script>

<template>
  <div class="memberships-container">
    <h2>Membresía</h2>
    <div class="memberships-grid">
      <div
          v-for="plan in plans"
          :key="plan.tipo"
          :class="['card-membership', { active: plan.tipo === currentPlan }]"
      >
        <div class="plan-header">
          <span class="label">Suscripción:</span>
          <span class="plan-name">{{ plan.tipo }}</span>
        </div>
        <div v-if="plan.fechaInicio" class="dates">
          <span>Inicio: {{ plan.fechaInicio }}</span>
          <span>Fin: {{ plan.fechaFin }}</span>
        </div>
        <ul class="features">
          <li v-for="(f, i) in plan.features" :key="i">{{ f }}</li>
        </ul>
        <button
            v-if="plan.tipo !== currentPlan"
            class="btn-acquire"
        >Adquirir</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memberships-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
.memberships-container h2 {
  font-size: 32px;
  color: #014728;
  margin-bottom: 30px;
  text-align: center;
}
.memberships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.card-membership {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 380px;
}
.card-membership:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
.card-membership.active {
  background: #014728;
  color: #fff;
}
.plan-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}
.label {
  font-size: 18px;
  font-weight: 500;
}
.plan-name {
  font-size: 48px;
  font-weight: bold;
  margin-top: 4px;
}
.card-membership.active .plan-name,
.card-membership.active .label {
  color: #fff;
}
.dates {
  font-size: 14px;
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.features {
  list-style: disc;
  padding-left: 20px;
  margin: 0 0 24px 0;
  flex: 1;
}
.features li {
  margin-bottom: 10px;
  line-height: 1.4;
}
.card-membership.active .features li {
  color: #e0f2e9;
}
.btn-acquire {
  align-self: flex-end;
  background: #9C7A36;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-acquire:hover {
  background: #b4975a;
}
.card-membership.active .btn-acquire {
  display: none;
}
</style>
