// Proxy local para la API de Gemini
// Reenvía cualquier POST a /api/gemini/* hacia https://ai-api-pearl-one.vercel.app/*
// Usa la variable de entorno VITE_GEMINI_API_KEY si está presente.

import 'dotenv/config'
import express from 'express'
import http from 'http'

const app = express()
app.use(express.json())

const TARGET_BASE = 'https://ai-api-pearl-one.vercel.app'
const PORT = process.env.PORT || 3001

app.post('/api/gemini/*', async (req, res) => {
  try {
    const path = req.path.replace(/^\/api\/gemini/, '') || '/'
    const url = TARGET_BASE + path

    // Construir headers: tomar Authorization de .env si existe, sino propagar la del cliente
    const apiKey = process.env.VITE_GEMINI_API_KEY || ''
    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    }

    if (!headers.Authorization && req.headers.authorization) {
      headers.Authorization = req.headers.authorization
    }

    console.log('[proxy] Forwarding POST to', url)
    console.log('[proxy] Using Authorization header present:', !!headers.Authorization)
    console.log('[proxy] Request body:', JSON.stringify(req.body))

    const fetchRes = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body)
    })

    const text = await fetchRes.text()
    const contentType = fetchRes.headers.get('content-type') || ''

    console.log('[proxy] Response status:', fetchRes.status)
    console.log('[proxy] Response content-type:', contentType)
    console.log('[proxy] Response body:', text)

    res.status(fetchRes.status)
    if (contentType.includes('application/json')) {
      try {
        res.json(JSON.parse(text || '{}'))
      } catch (e) {
        res.type('text').send(text)
      }
    } else {
      res.type('text').send(text)
    }
  } catch (err) {
    console.error('Proxy error:', err)
    res.status(502).json({ detail: 'Proxy error', message: String(err) })
  }
})

app.get('/', (req, res) => res.send(`Local proxy running. POST to /api/gemini/ask/v1/agro/ask`))

const server = http.createServer(app)
server.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT} -> ${TARGET_BASE}`))
