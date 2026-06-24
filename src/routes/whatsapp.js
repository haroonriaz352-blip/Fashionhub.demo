const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAIReply } = require('../ai');

// Webhook Verification
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('WhatsApp Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receive Messages
router.post('/', async (req, res) => {
  const body = req.body;
  console.log('WhatsApp webhook:', JSON.stringify(body, null, 2));

  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const value = change.value;
        if (value.messages) {
          for (const message of value.messages) {
            if (message.type === 'text') {
              const senderId = message.from;
              const messageText = message.text.body;
              console.log(`WhatsApp message from ${senderId}: ${messageText}`);
              let reply = await getAIReply(messageText);
              if (!reply) reply = 'Welcome to FashionHub! How can I help you?';
              await sendWhatsAppMessage(senderId, reply);
            }
          }
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Send WhatsApp Message
async function sendWhatsAppMessage(to, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`WhatsApp reply sent to ${to}`);
  } catch (error) {
    console.error('WhatsApp error:', error.response?.data || error.message);
  }
}

module.exports = router;