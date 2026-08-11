const express = require('express');
const app = express();

app.use(express.json());

// Endpoint de verificación de salud del servidor
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Magnate Core API' });
});

// Receptor del Webhook de Telegram
app.post('/webhook/telegram', (req, res) => {
  const update = req.body;
  console.log('Mensaje recibido en Telegram:', JSON.stringify(update, null, 2));
  
  // Responde inmediatamente a Telegram para confirmar recepción
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Magnate Core corriendo en puerto ${PORT}`);
});
