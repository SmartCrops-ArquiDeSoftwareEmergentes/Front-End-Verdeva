<script setup>
import Sidebar from "./shared/components/sidebar.component.vue"
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const showNotifications = ref(false)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const closeNotifications = () => {
  showNotifications.value = false
}
</script>

<template>
  <div id="app" @click="closeNotifications">
    <!-- Mostrar sidebar + toolbar solo si NO estamos en /login ni en /register -->
    <Sidebar v-if="route.path !== '/login' && route.path !== '/register'" />

    <div
        v-if="route.path !== '/login' && route.path !== '/register'"
        class="main"
    >
      <div class="toolbar">
        <input type="text" class="search-input" placeholder="Buscar en Nutricontrol..." />
        <div class="toolbar-icons">
          <div class="notification-container">
            <button class="icon-btn" @click.stop="toggleNotifications">
              <img
                  src="/topbar/alerts-icon.png"
                  width="35"
                  height="35"
                  alt="Alerts"
              />
            </button>
            <div v-if="showNotifications" class="notification-dropdown" @click.stop>
              <div class="notification-header">
                <h3>Notificaciones</h3>
                <button class="close-notifications" @click="closeNotifications">×</button>
              </div>
              <div class="notification-list">
                <div class="notification-item">
                  <div class="notification-icon">🌱</div>
                  <div class="notification-content">
                    <p class="notification-title">Riego programado</p>
                    <p class="notification-text">Campo de tomates necesita riego en 30 minutos</p>
                    <span class="notification-time">Hace 5 min</span>
                  </div>
                </div>
                <div class="notification-item">
                  <div class="notification-icon">📊</div>
                  <div class="notification-content">
                    <p class="notification-title">Análisis completado</p>
                    <p class="notification-text">Reporte semanal de cultivos disponible</p>
                    <span class="notification-time">Hace 1 hora</span>
                  </div>
                </div>
                <div class="notification-item">
                  <div class="notification-icon">⚠️</div>
                  <div class="notification-content">
                    <p class="notification-title">Alerta de humedad</p>
                    <p class="notification-text">Nivel de humedad bajo en campo 3</p>
                    <span class="notification-time">Hace 2 horas</span>
                  </div>
                </div>
              </div>
              <div class="notification-footer">
                <button class="view-all-btn">Ver todas las notificaciones</button>
              </div>
            </div>
          </div>
          <router-link to="/profile" class="icon-btn">
            <img
                src="/topbar/profile-icon.png"
                width="35"
                height="35"
                alt="Profile"
            />
          </router-link>
        </div>
      </div>
      <main class="content">
        <router-view />
      </main>
    </div>

    <!-- Para /login y /register solo renderizamos la vista -->
    <router-view v-if="route.path === '/login' || route.path === '/register'" />
  </div>
</template>

<style scoped>
#app {
  display: flex;
  height: 100vh;
  background: var(--gris-oscuro);
}
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: var(--blanco);
  box-shadow: 0 1px 4px rgba(1,71,40,0.08);
}
.search-input {
  width: 600px;
  max-width: 100%;
  height: 50px;
  padding: 0 15px;
  font-size: 16px;
  box-sizing: border-box;
  color: var(--verde-oscuro);
  border: 1px solid var(--verde-oscuro);
  border-radius: 10px;
  background: var(--blanco);
}
.search-input::placeholder {
  color: var(--marron-medio);
  opacity: 0.7;
}
input:focus {
  outline: none;
}

.toolbar-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}
.icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

/* Notification Dropdown Styles */
.notification-container {
  position: relative;
}
.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  max-height: 500px;
  background: var(--blanco);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(1,71,40,0.10);
  border: 1px solid var(--marron-medio);
  z-index: 1000;
  overflow: hidden;
  margin-top: 8px;
}
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}
.notification-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--verde-oscuro);
}
.close-notifications {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--gris-oscuro);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-notifications:hover {
  color: var(--marron-medio);
}
.notification-list {
  max-height: 350px;
  overflow-y: auto;
}
.notification-item {
  display: flex;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}
.notification-item:hover {
  background: #f8f9fa;
}
.notification-item:last-child {
  border-bottom: none;
}
.notification-icon {
  font-size: 24px;
  margin-right: 12px;
  flex-shrink: 0;
}
.notification-content {
  flex: 1;
}
.notification-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--verde-oscuro);
  margin: 0 0 4px 0;
}
.notification-text {
  font-size: 13px;
  color: var(--gris-oscuro);
  margin: 0 0 4px 0;
  line-height: 1.4;
}
.notification-time {
  font-size: 12px;
  color: var(--marron-medio);
}
.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}
.view-all-btn {
  width: 100%;
  padding: 8px 12px;
  background: var(--verde-oscuro);
  color: var(--blanco);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.view-all-btn:hover {
  background: var(--marron-medio);
}
.content {
  background: var(--blanco);
  color: var(--gris-oscuro);
  flex: 1;
  padding: 24px;
  border-radius: 12px;
  margin: 16px;
  box-shadow: 0 2px 8px rgba(1,71,40,0.05);
}

@media (max-width: 600px) {
  #app {
    flex-direction: column;
  }
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .search-input {
    width: 100%;
  }
  .toolbar-icons {
    justify-content: flex-end;
  }
}
</style>
