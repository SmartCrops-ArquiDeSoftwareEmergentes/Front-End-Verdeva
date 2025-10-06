<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombres = ref('')
const apellidos = ref('')
const correo = ref('')
const password = ref('')

const submit = () => {
  // Aquí podrías manejar registro via API
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <div class="register-image">
      <img src="/fondo-login-v2.jpeg" alt="Cultivo" />
    </div>
    <div class="register-form">
      <div class="form-wrapper">
        <div class="logo-container">
          <img src="/login/verdeva.jpeg" alt="Verdeva Logo" class="logo-image" />
        </div>
        <div class="fields">
          <input
              v-model="nombres"
              type="text"
              placeholder="Nombres*"
              class="text-input"
          />
          <input
              v-model="apellidos"
              type="text"
              placeholder="Apellidos*"
              class="text-input"
          />
          <input
              v-model="correo"
              type="email"
              placeholder="Correo electrónico*"
              class="text-input"
          />
          <input
              v-model="password"
              type="password"
              placeholder="Contraseña*"
              class="text-input"
          />
        </div>
        <button class="btn-register" @click="submit">Regístrate</button>
        <div class="footer-link">
          <span>¿Tienes una cuenta?</span>
          <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.register-image {
  flex: 2;
}
.register-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.register-form {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.95);
  padding: 40px 20px;
  box-sizing: border-box;
}
.form-wrapper {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo-container {
  margin-bottom: 16px;
}
.logo-image {
  width: 250px;
  height: auto;
}
.fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
.text-input {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  border: 2px solid #014728;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color .2s;
}
.text-input:focus {
  border-color: #9C7A36;
  outline: none;
}
.btn-register {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background: #014728;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background .2s, transform .1s;
  margin-bottom: 16px;
}
.btn-register:hover {
  background: #023d2e;
}
.btn-register:active {
  transform: scale(0.98);
}
.footer-link {
  font-size: 14px;
  color: #666;
}
.footer-link a {
  margin-left: 4px;
  color: #014728;
  text-decoration: none;
  font-weight: bold;
}
.footer-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }
  .register-image {
    height: 40vh;
  }
  .register-form {
    height: auto;
    overflow: visible;
    background: #fff;
  }
}
</style>
