<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = reactive({
  nombres: 'Hernan Emilio',
  apellidos: 'Morales Calderón',
  creacionCuenta: '10/05/2025',
  suscripcion: 'ESTÁNDAR',
  correo: 'ernan@gmail.com'
})

const goEdit = () => {
  router.push('/edit-profile')
}

const logout = () => {
  router.push('/login')
}
</script>

<template>
  <div class="profile-container">
    <h2>Mi Perfil</h2>
    <div class="profile-card">
      <div class="avatar-wrapper">
        <div class="avatar">{{ user.nombres.charAt(0) }}</div>
        <img src="/general-icons/edit-icon.png" alt="Editar" class="edit-icon" />
      </div>
      <ul class="details">
        <li><span class="label">Nombres:</span> {{ user.nombres }}</li>
        <li><span class="label">Apellidos:</span> {{ user.apellidos }}</li>
        <li><span class="label">Creación de cuenta:</span> {{ user.creacionCuenta }}</li>
        <li><span class="label">Suscripción:</span> {{ user.suscripcion }}</li>
        <li><span class="label">Correo electrónico:</span> {{ user.correo }}</li>
      </ul>
    </div>
    <button class="btn-edit" @click="goEdit">Editar Perfil</button>
    <div class="logout-container">
      <button class="btn-logout" @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  width: 100%;
  padding: 40px 20px;
  text-align: center;
}
.profile-container h2 {
  font-size: 40px;
  color: #014728;
  margin-bottom: 24px;
}
.profile-card {
  width: 100%;
  max-width: 900px;
  margin: 0 auto 20px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 48px;
  justify-content: center;
}
.avatar-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #014728;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
}
.edit-icon {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 44px;
  height: 44px;
  background: #9C7A36;
  border-radius: 50%;
  padding: 8px;
}
.details {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  color: #014728;
  font-size: 18px;
}
.details li {
  margin-bottom: 12px;
}
.label {
  font-weight: 600;
  font-size: 18px;
}
.btn-edit {
  margin-top: 20px;
  background: #9C7A36;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 12px 40px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-edit:hover {
  background: #b4975a;
}
.logout-container {
  margin-top: 30px;
  text-align: right;
  padding-right: 20px;
}
.btn-logout {
  margin-right: 20px;
  background: #014728;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 12px 32px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-logout:hover {
  background: #0f593d;
}
</style>
