import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Proxy para la API de Gemini en desarrollo (evita CORS)
      '/api/gemini': {
        target: 'https://ai-api-pearl-one.vercel.app',
        changeOrigin: true,
        secure: true,
        // Mantener rewrite para permitir rutas variables: /api/gemini/* -> /* en el target
        rewrite: path => path.replace(/^\/api\/gemini/, '')
      },
      '/api': {
        target: 'https://verdeva-ayagdeb0dceddwgw.canadacentral-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
