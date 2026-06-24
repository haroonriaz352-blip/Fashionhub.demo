function getAutoReply(message) {
  const msg = message.toLowerCase().trim();

  // Greetings
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('helo') ||
      msg.includes('salam') || msg.includes('assalam') || msg.includes('hey')) {
    return `Welcome to FashionHub! ❤️\nThank you for contacting us.\n\nHow may I help you today?\n\n1️⃣ New Arrivals\n2️⃣ Women's Collection\n3️⃣ Men's Collection\n4️⃣ Order Tracking\n5️⃣ Delivery Information\n\nReply with a number or ask your question!`;
  }

  // Price Queries
  if (msg.includes('price') || msg.includes('qeemat') || msg.includes('cost') ||
      msg.includes('kitna') || msg.includes('rate')) {
    return `💰 Our Price Ranges:\n\n👗 Dresses: Rs 2,999 - Rs 8,999\n👔 Men's Shirts: Rs 1,499 - Rs 3,999\n👜 Handbags: Rs 1,999 - Rs 5,999\n👟 Shoes: Rs 2,499 - Rs 6,999\n\nTell us which product you're interested in for exact price!`;
  }

  // Black Dress
  if (msg.includes('black dress') || msg.includes('kala dress') || msg.includes('black frock')) {
    return `🖤 Black Dresses Available:\n\n1. Black Embroidered Maxi\n   Price: Rs 4,999\n\n2. Black Chiffon Dress\n   Price: Rs 5,499\n\n3. Black Casual Frock\n   Price: Rs 2,999\n\nWould you like to place an order? Reply YES!`;
  }

  // Size Queries
  if (msg.includes('size') || msg.includes('sizing') || msg.includes('small') ||
      msg.includes('medium') || msg.includes('large') || msg.includes('xl')) {
    return `📏 Available Sizes:\n\nXS / S / M / L / XL / XXL\n\nFor best fit, please share your measurements:\n- Chest size\n- Waist size\n\nOr reply SIZE CHART for complete guide!`;
  }

  // Color Queries
  if (msg.includes('color') || msg.includes('colour') || msg.includes('rang') ||
      msg.includes('red') || msg.includes('blue') || msg.includes('beige') || msg.includes('white')) {
    return `🎨 Available Colors:\n\n🖤 Black\n🤍 White\n❤️ Red\n💙 Blue\n🩷 Pink\n🟤 Beige\n💚 Green\n\nTell us which color you want — we'll show matching products!`;
  }

  // Delivery Queries
  if (msg.includes('delivery') || msg.includes('shipping') || msg.includes('deliver') ||
      msg.includes('charges') || msg.includes('days') || msg.includes('kitne din')) {
    return `🚚 Delivery Information:\n\n📦 Delivery Charges: Rs 200 (Nationwide)\n⏰ Delivery Time: 3-5 Working Days\n🏙️ Lahore/Karachi/Islamabad: 2-3 Days\n🆓 Free delivery on orders above Rs 5,000!\n\nShare your city for more details!`;
  }

  // Exchange & Return
  if (msg.includes('exchange') || msg.includes('return') || msg.includes('refund') ||
      msg.includes('wapas') || msg.includes('damaged') || msg.includes('replace')) {
    return `🔄 Exchange & Return Policy:\n\n✅ Exchange within 7 days\n✅ Must be unused & with tags\n✅ Damaged items replaced for free\n❌ Sale items non-refundable\n\nFor exchange, contact us with your Order ID!`;
  }

  // Order Tracking
  if (msg.includes('track') || msg.includes('order') || msg.includes('parcel') ||
      msg.includes('status') || msg.includes('tracking')) {
    return `📦 Order Tracking:\n\nPlease share your:\n1. Order ID\n2. Phone Number\n\nWe'll update you within 1 hour! ⏰`;
  }

  // Discount & Sale
  if (msg.includes('discount') || msg.includes('sale') || msg.includes('offer') ||
      msg.includes('cheap') || msg.includes('sasta')) {
    return `🎉 Current Offers:\n\n🔥 Eid Sale — Up to 30% OFF!\n💝 Buy 2 Get 1 Free on selected items\n🆓 Free delivery above Rs 5,000\n\nType SALE to see discounted products!`;
  }

  // Place Order
  if (msg.includes('order') || msg.includes('buy') || msg.includes('purchase') ||
      msg.includes('lena') || msg.includes('chahiye')) {
    return `🛍️ To Place Your Order:\n\nPlease share:\n1. Product Name\n2. Size\n3. Color\n4. Delivery Address\n5. Phone Number\n\nWe'll confirm your order shortly! ✅`;
  }

  // Women Collection
  if (msg === '2' || msg.includes('women') || msg.includes('ladies') || msg.includes('girl')) {
    return `👗 Women's Collection:\n\n1. Embroidered Maxi — Rs 4,999\n2. Casual Frock — Rs 2,999\n3. Formal Suit — Rs 6,499\n4. Party Wear — Rs 7,999\n5. Summer Dress — Rs 3,499\n\nWhich one interests you?`;
  }

  // Men Collection
  if (msg === '3' || msg.includes('men') || msg.includes('gents') || msg.includes('boy') ||
      msg.includes('shirt') || msg.includes('trouser')) {
    return `👔 Men's Collection:\n\n1. Casual Shirt — Rs 1,499\n2. Formal Shirt — Rs 2,499\n3. Shalwar Kameez — Rs 2,999\n4. Jeans — Rs 2,499\n5. Kurta — Rs 1,999\n\nWhich one interests you?`;
  }

  // New Arrivals
  if (msg === '1' || msg.includes('new') || msg.includes('latest') || msg.includes('arrival')) {
    return `✨ New Arrivals:\n\n🔥 Eid Collection 2024 is HERE!\n\n1. Embroidered Lawn Suit — Rs 5,999\n2. Chiffon Maxi — Rs 6,499\n3. Printed Kurta — Rs 2,999\n4. Silk Dupatta — Rs 1,499\n\nLimited Stock — Order Now!`;
  }

  // Default Reply
  return `Thank you for your message! 😊\n\nI'm FashionHub AI Assistant. I can help you with:\n\n👗 Products & Prices\n📏 Sizes & Colors\n🚚 Delivery Info\n🔄 Exchange Policy\n📦 Order Tracking\n\nHow can I assist you today?`;
}

module.exports = { getAutoReply };