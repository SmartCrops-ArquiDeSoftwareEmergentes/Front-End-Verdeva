<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')

// Detectar si estamos en desarrollo o producción
const BASE_URL =
    import.meta.env.MODE === 'development'
        ? '/api' // usa el proxy configurado en vite.config.js
        : 'https://verdeva-ayagdeb0dceddwgw.canadacentral-01.azurewebsites.net'

const submit = async () => {
  try {
    const response = await axios.post(
        `${BASE_URL}/api/v1/User/login`, // ← URL dinámica
        {
          username: username.value,
          password: password.value
        }
    )

    const { jwt } = response.data

    // Guardar en localStorage
    localStorage.setItem('jwt_token', jwt)
    localStorage.setItem('username', username.value)

    // Mostrar en consola
    console.log('✅ Usuario logueado:', username.value)
    console.log('✅ JWT guardado:', jwt)

    alert('Inicio de sesión exitoso')
    router.push('/home')
  } catch (error) {
    alert('Credenciales inválidas o error de red')
    console.error('❌ Error en login:', error)
  }
}
</script>


<template>
  <div class="login-container">
    <div class="login-image">
      <img src="/fondo-login-v2.jpeg" alt="Cultivo" />
    </div>
    <div class="login-form">
      <div class="form-wrapper">
        <div class="logo-container">
          <img src="/login/verdeva.jpeg" alt="Verdeva Logo" class="logo-image" />
        </div>
        <p class="tagline">Empieza a cultivar resultados</p>
        <h2 class="title">Inicia sesión</h2>
        <div class="fields">
          <input v-model="username" type="text" placeholder="Nombre de usuario" class="text-input" />
          <input v-model="password" type="password" placeholder="Contraseña" class="text-input" />
        </div>
        <button class="btn-login" @click="submit">Iniciar sesión</button>
        <div class="footer-link">
          <span>¿No tienes una cuenta?</span>
          <a href="/register">Regístrate</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
}
.login-image {
  flex: 2;
  position: relative;
}
.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.login-form {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.95);
  height: 100vh;
  box-sizing: border-box;
  padding: 40px 20px;
  overflow: hidden;
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
.title {
  font-size: 32px;
  color: #014728;
  margin: 8px 0;
}
.tagline {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
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
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color .2s;
  box-sizing: border-box;
}
.text-input:focus {
  border-color: #014728;
  outline: none;
}
.btn-login {
  width: 180px;
  padding: 10px;
  font-size: 16px;
  background: #014728;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background .2s, transform .1s;
  margin-bottom: 16px;
}
.btn-login:hover {
  background: #023d2e;
}
.btn-login:active {
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
  .login-container {
    flex-direction: column;
  }
  .login-image {
    height: 40vh;
  }
  .login-form {
    background: #fff;
    height: auto;
    overflow: visible;
  }
}
</style>