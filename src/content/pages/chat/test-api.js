// Script de prueba para verificar la conectividad con la API de chat
// Ejecutar desde la consola del navegador en la página del chat

async function testChatAPI() {
  console.log('🧪 Iniciando prueba de la API de Chat...\n');

  const API_BASE = '/ai-api'; // Proxy de Netlify
  const endpoint = `${API_BASE}/v1/agro/chat`;

  const testPayload = {
    question: '¿Cómo regar el tomate?',
    crop: 'tomate',
    stage: 'floracion',
    length: 'short'
  };

  console.log('📤 Enviando request a:', endpoint);
  console.log('📦 Payload:', testPayload);

  try {
    const startTime = Date.now();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️ Tiempo de respuesta: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error:', errorData);
      return;
    }

    const data = await response.json();

    console.log('✅ Respuesta exitosa!');
    console.log('📝 Modelo:', data.model);
    console.log('💬 Respuesta:', data.answer);

    if (data.tips) {
      console.log('💡 Tips:', data.tips);
    }

    console.log('\n🎉 ¡Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
  }
}

// Ejecutar la prueba
testChatAPI();

