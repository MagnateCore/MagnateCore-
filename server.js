const express = require('express');
const axios = require('axios'); // Para reenviar a Activepieces

const app = express();
app.use(express.json());

// Endpoint de verificación de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Magnate Core' });
});

// Receptor del Webhook de Telegram y reenvío a Activepieces
app.post('/webhook/telegram', async (req, res) => {
  const update = req.body;
  console.log('Mensaje recibido en Telegram:', JSON.stringify(update, null, 2));

  // Reenviar a Activepieces usando la URL guardada en los Secrets
  const activepiecesUrl = process.env.WEBHOOK_ROUTER_URL;

  if (activepiecesUrl) {
    try {
      await axios.post(activepiecesUrl, update);
      console.log('Reenviado con éxito a Activepieces');
    } catch (error) {
      console.error('Error al reenviar a Activepieces:', error.message);
    }
  }

  // Responder siempre 200 OK a Telegram
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Magnate Core corriendo en puerto ${PORT}`);
});
