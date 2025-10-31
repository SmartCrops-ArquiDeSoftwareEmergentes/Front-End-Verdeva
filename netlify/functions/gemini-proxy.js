// Netlify function (ESM) que actúa como proxy hacia la API de Gemini en Vercel
// Intenta varias rutas si recibe 404. Lee la API key desde las variables de entorno.

export const handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' })
    }
  }

  const endpoints = [
    'https://ai-api-pearl-one.vercel.app/ask/v1/agro/ask',
    'https://ai-api-pearl-one.vercel.app/ask_v1/agro/ask'
  ]

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''

  const headers = {
    'Content-Type': 'application/json'
  }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

  let lastRes = null
  for (let i = 0; i < endpoints.length; i++) {
    const url = endpoints[i]
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })
      lastRes = res
      const text = await res.text()
      const contentType = res.headers.get('content-type') || ''
      // Si responde OK (2xx) devolvemos la respuesta tal cual
      if (res.ok) {
        const responseBody = contentType.includes('application/json') ? JSON.parse(text || '{}') : { text }
        return {
          statusCode: res.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(responseBody)
        }
      }

      // Si fue 404 intentamos la siguiente ruta
      if (res.status === 404) {
        // seguimos al siguiente endpoint
      } else {
        // Para otros códigos devolvemos el error directo
        const errorBody = contentType.includes('application/json') ? JSON.parse(text || '{}') : { text }
        return {
          statusCode: res.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: errorBody })
        }
      }

    } catch (err) {
      lastRes = err
      // seguir al siguiente endpoint
    }
  }

  // Si llegamos aquí, no obtuvimos una respuesta exitosa
  const fallbackBody = lastRes && lastRes.status ? { detail: 'No se pudo contactar al backend', status: lastRes.status } : { detail: 'No se pudo contactar al backend' }
  return {
    statusCode: 502,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(fallbackBody)
  }
}
