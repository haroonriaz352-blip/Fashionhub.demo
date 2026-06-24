const Product = require('./models/Product');

async function getProductRecommendations(query) {
  try {
    let filter = {};
    const q = query.toLowerCase();

    // Gender based
    if (q.includes('women') || q.includes('ladies') || q.includes('girl') || 
        q.includes('dress') || q.includes('frock') || q.includes('maxi')) {
      filter.category = { $in: ['Women', 'women', 'Ladies'] };
    } else if (q.includes('men') || q.includes('gents') || q.includes('boy') || 
               q.includes('shirt') || q.includes('kurta')) {
      filter.category = { $in: ['Men', 'men', 'Gents'] };
    }

    // Color based
    const colors = ['black', 'white', 'red', 'blue', 'pink', 'beige', 'green'];
    for (const color of colors) {
      if (q.includes(color)) {
        filter.colors = { $in: [color, color.charAt(0).toUpperCase() + color.slice(1)] };
        break;
      }
    }

    // Budget based
    if (q.includes('under 2000') || q.includes('2000 se kam')) {
      filter.price = { $lte: 2000 };
    } else if (q.includes('under 3000') || q.includes('3000 se kam')) {
      filter.price = { $lte: 3000 };
    } else if (q.includes('under 5000') || q.includes('5000 se kam')) {
      filter.price = { $lte: 5000 };
    } else if (q.includes('cheap') || q.includes('sasta')) {
      filter.price = { $lte: 2000 };
    }

    // Category based
    if (q.includes('formal')) {
      filter.category = { $in: ['Formal', 'formal'] };
    } else if (q.includes('casual')) {
      filter.category = { $in: ['Casual', 'casual'] };
    } else if (q.includes('summer')) {
      filter.category = { $in: ['Summer', 'summer'] };
    } else if (q.includes('winter')) {
      filter.category = { $in: ['Winter', 'winter'] };
    } else if (q.includes('handbag') || q.includes('bag')) {
      filter.category = { $in: ['Handbags', 'handbags', 'Bags'] };
    } else if (q.includes('shoes') || q.includes('footwear')) {
      filter.category = { $in: ['Shoes', 'shoes', 'Footwear'] };
    }

    // Stock filter
    filter.stock = { $gt: 0 };

    // Get products
    let products = await Product.find(filter).limit(3);

    // If no products found with filters, get trending
    if (products.length === 0) {
      products = await Product.find({ stock: { $gt: 0 } })
        .sort({ rating: -1 })
        .limit(3);
    }

    return products;
  } catch (error) {
    console.error('Recommendation Error:', error);
    return [];
  }
}

function formatProductReply(products, query) {
  if (products.length === 0) {
    return `Abhi is category mein products available nahi hain. Hum jald hi naye products add karein ge! 😊\n\nKya main aapki kisi aur cheez mein help kar sakta hoon?`;
  }

  let reply = `🛍️ Aapke liye yeh products available hain:\n\n`;

  products.forEach((product, index) => {
    reply += `${index + 1}. *${product.name}*\n`;
    reply += `   💰 Price: Rs ${product.price}\n`;
    if (product.colors && product.colors.length > 0) {
      reply += `   🎨 Colors: ${product.colors.join(', ')}\n`;
    }
    if (product.sizes && product.sizes.length > 0) {
      reply += `   📏 Sizes: ${product.sizes.join(', ')}\n`;
    }
    if (product.discount > 0) {
      reply += `   🔥 Discount: ${product.discount}% OFF\n`;
    }
    reply += '\n';
  });

  reply += `Order place karne ke liye apna size, color aur address share karein! ✅`;

  return reply;
}

module.exports = { getProductRecommendations, formatProductReply };