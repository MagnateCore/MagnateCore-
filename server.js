const express = require('express');
const axios = require('axios');
const app = express();

// Middlewares obligatorios para procesar payloads JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de constantes y credenciales
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8696343780:AAFCnD7cnLAqjaYVJJzKv9rKRj_G_lzZYRY';
const LOGS_CHANNEL_ID = process.env.LOGS_CHANNEL_ID || '-1003756613161';

// Endpoint de prueba de vida (Health Check)
app.get('/', (req, res) => {
  res.status(200).send('Magnate Core Router activo y escuchando.');
});

// Endpoint principal para recibir Webhooks de Telegram
app.post('/webhook', async (req, res) => {
  // Telegram exige un HTTP 200 inmediato para no reintentar la entrega
  res.status(200).send('OK');

  try {
    const update = req.body;

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

      // 1. Enviar respuesta directa al usuario
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: replyText
      });

      // 2. Transmitir evento al Canal de Logs
      const logMessage = `LOG MAGNATE CORE:\nUsuario ID: ${chatId}\nComando: ${text}`;
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: LOGS_CHANNEL_ID,
        text: logMessage
      });
    }
  } catch (error) {
    console.error('Error al procesar update de Telegram:', error.response ? error.response.data : error.message);
  }
});

// Inicialización del servidor HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Magnate Core escuchando en el puerto ${PORT}`);
});
