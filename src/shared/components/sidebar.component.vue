<template>
  <aside :class="['sidebar', { open: isOpen }]">
    <button class="close-btn" v-if="isOpen" @click="toggleSidebar">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/>
      </svg>
    </button>
    <div class="logo-container">
      <img src="/login/verdeva.jpeg" width="180" height="90" alt="Verdeva Logo" />
    </div>
    <hr class="separator" />
    <nav class="nav-links">
      <router-link to="/home" class="nav-link">
        <img src="/sidebar/icons/home-icon.png" width="30" height="30" alt="" />
        <span>Inicio</span>
      </router-link>
      <router-link to="/fields" class="nav-link">
        <img src="/sidebar/icons/crop-icon.png" width="30" height="30" alt="" />
        <span>Campos Agrícolas</span>
      </router-link>
      <router-link to="/recommendations" class="nav-link">
        <img src="/sidebar/icons/recommendation-icon.png" width="30" height="30" alt="" />
        <span>Recomendaciones</span>
      </router-link>
      <router-link to="/all-analytics" class="nav-link">
        <img src="/sidebar/icons/analytics-icon.png" width="30" height="30" alt="" />
        <span>Análisis Predictivo</span>
      </router-link>
      <router-link to="/memberships" class="nav-link">
        <img src="/sidebar/icons/membership-icon.png" width="30" height="30" alt="" />
        <span>Membresía</span>
      </router-link>
      <router-link to="/real-time-sensors" class="nav-link">
        <img src="/sidebar/icons/ICONOTIME.png" width="30" height="30" alt="" />
        <span>Lectura de Sensores</span>
      </router-link>
    </nav>
  </aside>
  <button class="burger-btn" v-if="!isOpen" @click="toggleSidebar">
    <span></span>
    <span></span>
    <span></span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.sidebar {
  position: relative;
  width: 350px;
  height: 100vh;
  background-color: var(--verde-oscuro);
  padding: 30px 20px;
  box-sizing: border-box;
  transition: transform .3s;
  overflow: hidden;
}
.logo-container { display: flex; justify-content: center; align-items: center; height: 90px; margin-bottom: 30px; }
.separator { margin: 20px 0; border: none; height: 2px; border-radius: 1px; background-color: rgba(255,255,255,0.3); }
.nav-links { display: flex; flex-direction: column; gap: 25px; }
.nav-link { display: flex; align-items: center; gap: 15px; font-size: 20px; font-weight: 600; color: var(--blanco); text-decoration: none; }
.nav-link:hover { color: var(--marron-medio); }
.burger-btn, .close-btn { display: none; }

@media (max-width: 600px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-260px);
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar .logo-container,
  .sidebar .separator,
  .sidebar .nav-links { display: none; }
  .sidebar.open .logo-container,
  .sidebar.open .separator,
  .sidebar.open .nav-links { display: block; }
  .burger-btn {
    display: block;
    position: fixed;
    top: 20px;
    left: 20px;
    background: none;
    border: none;
    padding: 0;
    z-index: 1001;
    cursor: pointer;
  }
  .burger-btn span {
    display: block;
    width: 30px;
    height: 3px;
    background-color: white;
    margin: 5px 0;
  }
  .close-btn {
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    padding: 0;
    z-index: 1001;
    cursor: pointer;
  }
}
</style>
