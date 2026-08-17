const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8696343780:AAFCnD7cnLAqjaYVJJzKv9rKRj_G_lzZYRY';
const LOGS_CHAT_ID = process.env.LOGS_CHAT_ID || '-1003756613161';
const ACTIVEPIECES_IPN_WEBHOOK = process.env.ACTIVEPIECES_IPN_WEBHOOK || '';

app.post('/webhook/nowpayments', async (req, res) => {
    try {
        const payload = req.body;

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: LOGS_CHAT_ID,
            text: `💰 **NUEVA VENTA / IPN**\n\nID: \`${payload.payment_id || 'N/A'}\`\nEstado: \`${payload.payment_status || 'N/A'}\``,
            parse_mode: 'Markdown'
        });

        if (ACTIVEPIECES_IPN_WEBHOOK) {
            await axios.post(ACTIVEPIECES_IPN_WEBHOOK, payload);
        }

        return res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Error IPN:', error.message);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/webhook/telegram', async (req, res) => {
    try {
        const update = req.body;

        if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const text = update.message.text.trim();
            const firstName = update.message.from.first_name || 'Cliente';

            let replyText = '';

            if (text.startsWith('/start')) {
                replyText = '🔥 **Bienvenido a Magnate Core**, ' + firstName + '.\n\nSelecciona el plan que deseas adquirir:\n\n';
            } else if (text.startsWith('/catalogo')) {
                replyText = '📦 **Catálogo Oficial Magnate Core**\n\nPlan Básico: $29 USDT\nPlan Pro: $297 USDT\nPlan Magnate: $997 USDT';
            } else {
                replyText = 'Comando no reconocido. Utiliza /start o /catalogo.';
            }

            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: chatId,
                text: replyText,
                parse_mode: 'Markdown'
            });
        }

        return res.status(200).send('OK');
    } catch (error) {
        console.error('Error Telegram:', error.message);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/health', (req, res) => res.status(200).json({ status: 'online' }));

app.listen(PORT, () => console.log(`Magnate Core Router activo en puerto ${PORT}`));
