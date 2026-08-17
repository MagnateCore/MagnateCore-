const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8696343780:AAFCnD7cnLAqjaYVJJzKv9rKRj_G_lzZYRY';
const LOGS_CHANNEL_ID = process.env.LOGS_CHANNEL_ID || '-1003756613161';

app.get('/', (req, res) => {
  res.status(200).send('Magnate Core Router activo y escuchando.');
});

app.post('/webhook', async (req, res) => {
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

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText
        })
      });

      const logMessage = `LOG MAGNATE CORE:\nUsuario ID: ${chatId}\nComando: ${text}`;
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: LOGS_CHANNEL_ID,
          text: logMessage
        })
      });
    }
  } catch (error) {
    console.error('Error procesando actualización de Telegram:', error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Magnate Core escuchando en el puerto ${PORT}`);
});
