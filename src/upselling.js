const upsellMap = {
  // Dress related
  'dress': ['Black Jeans', 'Leather Belt', 'Heels', 'Handbag'],
  'maxi': ['Dupatta', 'Heels', 'Clutch Bag'],
  'frock': ['Leggings', 'Flats', 'Handbag'],
  
  // Men related
  'shirt': ['Black Jeans', 'Leather Belt', 'Formal Shoes'],
  'kurta': ['Shalwar', 'Khussa', 'Waistcoat'],
  'jeans': ['Casual Shirt', 'Sneakers', 'Belt'],
  
  // Accessories
  'handbag': ['Matching Shoes', 'Belt', 'Wallet'],
  'shoes': ['Matching Belt', 'Socks', 'Shoe Polish'],
};

function getUpsellSuggestions(productName) {
  if (!productName) return null;
  
  const name = productName.toLowerCase();
  
  for (const [keyword, suggestions] of Object.entries(upsellMap)) {
    if (name.includes(keyword)) {
      return suggestions;
    }
  }
  
  return ['Matching Belt', 'Handbag', 'Shoes'];
}

function formatUpsellMessage(productName, suggestions) {
  if (!suggestions || suggestions.length === 0) return null;
  
  return `🛍️ You selected *${productName}*!\n\nCustomers also bought:\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWould you like to add these items? Reply YES! ✅`;
}

module.exports = { getUpsellSuggestions, formatUpsellMessage };