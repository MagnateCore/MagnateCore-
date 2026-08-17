const express = require('express');
const axios = require('axios');
const app = express();

// Middleware obligatorio para parsear JSON de Telegram
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8696343780:AAFCnD7cnLAqjaYVJJzKv9rKRj_G_lzZYRY';
const LOGS_CHANNEL_ID = '-1003756613161';

// Endpoint de prueba de salud
app.get('/', (req, res) => {
  res.status(200).send('Magnate Core Router activo y escuchando.');
});

// Endpoint del Webhook de Telegram
app.post('/webhook', async (req, res) => {
  // Telegram exige responder HTTP 200 de inmediato para evitar reintentos o bloqueos
  res.status(200).send('OK');

  try {
    const update = req.body;
    console.log('Update recibido de Telegram:', JSON.stringify(update));

    if (update && update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      let replyText = 'Comando no reconocido. Utiliza /start para ver las opciones.';

      if (text === '/start') {
        replyText = '¡Bienvenido a Magnate Core! Usa /catalogo para ver las opciones disponibles.';
      } else if (text === '/catalogo' || text === '/catalog') {
        replyText = 'Catálogo Magnate Core:\n1. Servicio de Automatización\n2. Licencia Magnate Engine';
      } else if (text === '/ayuda') {
        replyText = 'Soporte técnico activo. Contacta a un administrador.';
      }

      // 1. Responder al usuario en el chat privado
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: replyText
      });

      // 2. Notificar al Canal de Logs
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: LOGS_CHANNEL_ID,
        text: `LOG MAGNATE CORE:\nUsuario ID: ${chatId}\nComando: ${text}`
      });
    }
  } catch (error) {
    console.error('Error procesando update:', error.response ? error.response.data : error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
