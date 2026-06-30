require('dotenv').config();
const express = require('express');
const router = express.Router();

// N8N se aane wale processed messages ko save karna (dashboard ke liye)
// N8N workflow ke end mein ek HTTP Request node se ye route call hoga
router.post('/log', async (req, res) => {
  try {
    const { senderId, customerMessage, botReply, timestamp } = req.body;

    console.log('Logging conversation:', { senderId, customerMessage, botReply });

    // TODO: Yahan apna Mongoose model use karke MongoDB mein save karo
    // Example (apne Customer/Order models ki tarah ek "Conversation" model bana sakte ho):
    //
    // await Conversation.create({
    //   senderId,
    //   customerMessage,
    //   botReply,
    //   timestamp: timestamp || new Date()
    // });

    res.status(200).json({ status: 'logged' });
  } catch (error) {
    console.error('Error logging conversation:', error.message);
    res.status(500).json({ error: 'Failed to log conversation' });
  }
});

module.exports = router;