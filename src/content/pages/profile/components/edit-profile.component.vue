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

const goProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="edit-profile-container">
    <h2>Mi Perfil</h2>
    <div class="profile-card">
      <div class="avatar-wrapper">
        <div class="avatar">{{ user.nombres.charAt(0) }}</div>
        <img src="/general-icons/edit-icon.png" alt="Editar" class="edit-icon" />
      </div>
      <div class="form-fields">
        <input
            type="text"
            v-model="user.nombres"
            placeholder="Nombres"
            class="text-input"
        />
        <input
            type="text"
            v-model="user.apellidos"
            placeholder="Apellidos"
            class="text-input"
        />
        <input
            type="email"
            v-model="user.correo"
            placeholder="Correo electrónico"
            class="text-input"
        />
      </div>
    </div>
    <img
        src="/general-icons/check-icon.png"
        alt="Guardar cambios"
        class="save-icon"
        @click="goProfile"
    />
  </div>
</template>

<style scoped>
.edit-profile-container {
  width: 100%;
  padding: 40px 20px;
  text-align: center;
}
.edit-profile-container h2 {
  font-size: 40px;
  color: #014728;
  margin-bottom: 24px;
}
.profile-card {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
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
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
}
.text-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 18px;
  border: 2px solid #014728;
  border-radius: 8px;
  outline: none;
  color: #014728;
  background: #fff;
  box-sizing: border-box;
}
.text-input:focus {
  border-color: #9C7A36;
}
.save-icon {
  display: block;
  margin: 24px auto 0;
  width: 56px;
  height: 56px;
  background: #014728;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
}
</style>
