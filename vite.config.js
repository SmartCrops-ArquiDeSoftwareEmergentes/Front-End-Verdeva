import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Proxy para la API de Gemini legacy (si aún se usa)
      '/api/gemini': {
        target: 'https://ai-api-pearl-one.vercel.app',
        changeOrigin: true,
        secure: true,
        // Mantener rewrite para permitir rutas variables: /api/gemini/* -> /* en el target
        rewrite: path => path.replace(/^\/api\/gemini/, '')
      },
      // Backend general existente
      '/api': {
        target: 'https://verdeva-ayagdeb0dceddwgw.canadacentral-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      // Proxy AI-API hacia Vercel para evitar CORS
      '/ai-api': {
        target: 'https://ai-api-pearl-one.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/ai-api/, '')
      }
    }
  }
})
