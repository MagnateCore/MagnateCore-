const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8696343780:AAFCnD7cnLAqjaYVJJzKv9rKRj_G_lzZYRY';
const LOGS_CHANNEL_ID = '-1003756613161';

// Endpoint para el Webhook de Telegram
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      let replyText = 'Comando no reconocido. Utiliza /start para ver las opciones.';

      if (text === '/start') {
        replyText = '¡Bienvenido a Magnate Core! Usa /catalogo para ver las opciones disponibles.';
      } else if (text === '/catalogo' || text === '/Catálogo' || text === '/catalog') {
        replyText = 'Catálogo Magnate Core:\n1. Servicio de Automatización\n2. Licencia Magnate Engine';
      } else if (text === '/ayuda') {
        replyText = 'Soporte técnico activo. Contacta a un administrador.';
      }

      // Enviar respuesta al usuario
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: replyText
      });

      // Registrar evento en Canal de Logs
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: LOGS_CHANNEL_ID,
        text: `LOG MAGNATE CORE:\nUsuario ID: ${chatId}\nComando: ${text}`
      });
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Error Telegram:', error.message);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Magnate Core Router activo en puerto ${PORT}`);
});
