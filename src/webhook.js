require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

const N8N_WEBHOOK_URL = 'https://haroonriaz.app.n8n.cloud/webhook/fashionhub-bot';

// Webhook Verification
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receive Messages aur N8N ko forward karo
router.post('/', async (req, res) => {
  const body = req.body;
  console.log('Webhook received:', JSON.stringify(body, null, 2));

  // Pehle Meta ko 200 OK do
  res.sendStatus(200);

  // Sirf actual text messages forward karo, read/delivery/reaction events skip karo
  const hasTextMessage = body.entry?.some(entry =>
    entry.messaging?.some(m => m.message && m.message.text)
  );

  if (!hasTextMessage) {
    console.log('Skipping non-text event (read/delivery/reaction)');
    return;
  }

  try {
    // N8N ko forward karo
    await axios.post(N8N_WEBHOOK_URL, body);
    console.log('Forwarded to N8N successfully');
  } catch (error) {
    console.error('Error forwarding to N8N:', error.message);
  }
});

module.exports = router;