const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8696343780:AAFCnD7cnLAqjaYVJJzKv9rKRj_G_lzZYRY';
const LOGS_CHANNEL_ID = '-1003756613161';

function sendTelegramMessage(chatId, text) {
    const data = JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' });
    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const req = https.request(options, (res) => {
        res.on('data', () => {});
    });

    req.on('error', (e) => {
        console.error(`Error enviando mensaje a Telegram: ${e.message}`);
    });

    req.write(data);
    req.end();
}

app.get('/', (req, res) => {
    res.status(200).send('Magnate Core Router activo y escuchando.');
});

app.post('/webhook', (req, res) => {
    res.status(200).send('OK');

    try {
        const update = req.body;
        if (update && update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const text = update.message.text.trim();

            let replyText = 'Comando no reconocido. Utiliza /start para ver las opciones.';

            if (text === '/start') {
                replyText = '¡Bienvenido a Magnate Core! Usa /catalogo para ver las opciones disponibles.';
            } else if (text.toLowerCase() === '/catalogo' || text.toLowerCase() === '/catalog') {
                replyText = 'Catálogo Magnate Core:\n1. Servicio de Automatización\n2. Licencia Magnate Engine';
            } else if (text.toLowerCase() === '/ayuda') {
                replyText = 'Soporte técnico activo. Contacta a un administrador.';
            }

            sendTelegramMessage(chatId, replyText);
            sendTelegramMessage(LOGS_CHANNEL_ID, `LOG MAGNATE CORE:\nUsuario ID: ${chatId}\nComando: ${text}`);
        }
    } catch (error) {
        console.error('Error interno procesando webhook:', error);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Magnate Core activo en el puerto ${PORT}`);
});
