require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getAutoReply } = require('./responses');
const { getAIReply, detectIntent, detectSentiment } = require('./ai');
const { getProductRecommendations, formatProductReply } = require('./recommendation');
const { getUpsellSuggestions, formatUpsellMessage } = require('./upselling');
const axios = require('axios');

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

// Receive Messages
router.post('/', async (req, res) => {
  const body = req.body;
  console.log('Webhook received:', JSON.stringify(body, null, 2));

  if (body.object === 'instagram') {
    for (const entry of body.entry) {

      // messaging array
      if (entry.messaging) {
        for (const event of entry.messaging) {
          if (event.message && event.message.text) {
            const senderId = event.sender.id;
            const messageText = event.message.text;
            console.log(`Message from ${senderId}: ${messageText}`);

            const intent = await detectIntent(messageText);
            const sentiment = await detectSentiment(messageText);
            console.log(`Intent: ${intent} | Sentiment: ${sentiment}`);

            // Product Recommendation Check
            const productKeywords = ['dress', 'shirt', 'kurta', 'maxi', 'frock',
              'handbag', 'shoes', 'black', 'red', 'blue', 'under 2000', 'under 3000',
              'under 5000', 'cheap', 'sasta', 'formal', 'casual', 'summer', 'winter',
              'eid', 'party'];
            const isProductQuery = productKeywords.some(k =>
              messageText.toLowerCase().includes(k)
            );

            let reply;
            if (isProductQuery) {
              const products = await getProductRecommendations(messageText);
              if (products.length > 0) {
                reply = formatProductReply(products, messageText);
              }
            }

            if (!reply) reply = await getAIReply(messageText);
            if (!reply) reply = getAutoReply(messageText);

            await sendMessage(senderId, reply);

            // Auto Upselling
            const upsellKeywords = ['black dress', 'maxi', 'shirt', 'kurta',
              'jeans', 'handbag', 'shoes', 'frock'];
            const isUpsellProduct = upsellKeywords.some(k =>
              messageText.toLowerCase().includes(k)
            );
            if (isUpsellProduct) {
              const suggestions = getUpsellSuggestions(messageText);
              const upsellMsg = formatUpsellMessage(messageText, suggestions);
              if (upsellMsg) {
                setTimeout(async () => {
                  await sendMessage(senderId, upsellMsg);
                }, 2000);
              }
            }
          }
        }
      }

      // changes array
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const msg = change.value;
            if (msg && msg.message && msg.sender) {
              const senderId = msg.sender.id;
              const messageText = msg.message.text;
              console.log(`Message from ${senderId}: ${messageText}`);

              const intent = await detectIntent(messageText);
              const sentiment = await detectSentiment(messageText);
              console.log(`Intent: ${intent} | Sentiment: ${sentiment}`);

              // Product Recommendation Check
              const productKeywords = ['dress', 'shirt', 'kurta', 'maxi', 'frock',
                'handbag', 'shoes', 'black', 'red', 'blue', 'under 2000', 'under 3000',
                'under 5000', 'cheap', 'sasta', 'formal', 'casual', 'summer', 'winter',
                'eid', 'party'];
              const isProductQuery = productKeywords.some(k =>
                messageText.toLowerCase().includes(k)
              );

              let reply;
              if (isProductQuery) {
                const products = await getProductRecommendations(messageText);
                if (products.length > 0) {
                  reply = formatProductReply(products, messageText);
                }
              }

              if (!reply) reply = await getAIReply(messageText);
              if (!reply) reply = getAutoReply(messageText);

              await sendMessage(senderId, reply);

              // Auto Upselling
              const upsellKeywords = ['black dress', 'maxi', 'shirt', 'kurta',
                'jeans', 'handbag', 'shoes', 'frock'];
              const isUpsellProduct = upsellKeywords.some(k =>
                messageText.toLowerCase().includes(k)
              );
              if (isUpsellProduct) {
                const suggestions = getUpsellSuggestions(messageText);
                const upsellMsg = formatUpsellMessage(messageText, suggestions);
                if (upsellMsg) {
                  setTimeout(async () => {
                    await sendMessage(senderId, upsellMsg);
                  }, 2000);
                }
              }
            }
          }
        }
      }
    }
    res.sendStatus(200);
  } else {
    console.log('Other webhook:', JSON.stringify(body, null, 2));
    res.sendStatus(200);
  }
});

// Send Message Function
async function sendMessage(recipientId, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v21.0/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message }
      },
      {
        params: { access_token: process.env.PAGE_ACCESS_TOKEN }
      }
    );
    console.log(`Reply sent to ${recipientId}`);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

module.exports = router;