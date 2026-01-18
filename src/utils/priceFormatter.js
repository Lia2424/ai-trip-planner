export const formatPrice = (price) => {
  if (!price) return 'Price not available';
  
  // If already has $ symbol, return as is
  if (price.includes('$')) {
    return price;
  }
  
  // Remove other currency symbols and replace with $
  let formatted = price
    .replace(/€/g, '$')  // Replace Euro symbol
    .replace(/£/g, '$')  // Replace Pound symbol
    .replace(/¥/g, '$')  // Replace Yen symbol
    .replace(/₹/g, '$')  // Replace Rupee symbol
    .replace(/USD/g, '$') // Replace USD text
    .replace(/usd/gi, '$'); // Replace usd text (case insensitive)
  
  // If no currency symbol at all, add $ at the beginning
  if (!formatted.match(/[\$€£¥₹]/)) {
    // Check if it starts with a number
    if (formatted.match(/^\d/)) {
      formatted = '$' + formatted;
    }
  }
  
  return formatted;
};

