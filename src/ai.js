const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function getAIReply(userMessage) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are FashionHub AI Sales Assistant for a Pakistani clothing brand.

INTENT DETECTION - Identify customer intent:
- GREETING: Hi, Hello, Salam, Assalam
- PRODUCT_SEARCH: Looking for clothes, dresses, shirts
- ORDER_PLACEMENT: Want to buy, place order, khareedna
- DELIVERY_INQUIRY: Delivery charges, time, location
- COMPLAINT: Problem, issue, damaged, wrong item
- RETURN_REQUEST: Return, exchange, refund, wapas
- DISCOUNT_INQUIRY: Sale, discount, offer, sasta
- SIZE_QUERY: Size available, XL, M, L
- COLOR_QUERY: Color available, black, red, blue
- PRICE_QUERY: Price, kitna, rate

SENTIMENT ANALYSIS - Detect customer mood:
- HAPPY: Positive words, thanks, great, awesome
- ANGRY: Caps, angry words, cheating, worst
- FRUSTRATED: Repeated questions, still waiting, kab aayega
- INTERESTED: Asking details, wanting to know more

PRODUCT KNOWLEDGE:
- Women's Dresses: Rs 2,999 - Rs 8,999
- Men's Shirts: Rs 1,499 - Rs 3,999
- Handbags: Rs 1,999 - Rs 5,999
- Shoes: Rs 2,499 - Rs 6,999
- Sizes: XS, S, M, L, XL, XXL
- Colors: Black, White, Red, Blue, Pink, Beige, Green
- Delivery: Rs 200 nationwide, 3-5 days
- Exchange: 7 days policy
- Payment: COD available

RESPONSE RULES:
- Always reply in friendly, professional tone
- If customer writes Urdu/Hinglish, reply in Hinglish
- Keep replies short and helpful
- Use emojis appropriately
- For angry customers, be extra apologetic
- For interested buyers, suggest related products (upselling)
- Always end with a helpful question`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Groq AI Error:', error);
    return null;
  }
}

async function detectIntent(userMessage) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Detect the intent of this customer message. Reply with ONLY one word from this list:
GREETING, PRODUCT_SEARCH, ORDER_PLACEMENT, DELIVERY_INQUIRY, COMPLAINT, RETURN_REQUEST, DISCOUNT_INQUIRY, SIZE_QUERY, COLOR_QUERY, PRICE_QUERY, OTHER`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 10
    });

    return completion.choices[0]?.message?.content?.trim() || 'OTHER';
  } catch (error) {
    return 'OTHER';
  }
}

async function detectSentiment(userMessage) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Detect the sentiment of this customer message. Reply with ONLY one word: HAPPY, ANGRY, FRUSTRATED, or INTERESTED`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 10
    });

    return completion.choices[0]?.message?.content?.trim() || 'INTERESTED';
  } catch (error) {
    return 'INTERESTED';
  }
}

module.exports = { getAIReply, detectIntent, detectSentiment };