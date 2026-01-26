/**
 * Optimizes Cloudinary image URLs with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Optimization options
 * @param {number} options.width - Desired width in pixels
 * @param {string} options.quality - Quality setting ('auto', 'best', or 1-100)
 * @param {string} options.format - Format ('auto', 'webp', 'avif', 'jpg', 'png')
 * @returns {string} Optimized URL
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  const {
    width = 400,
    quality = 'auto',
    format = 'auto',
  } = options;

  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Insert transformations into Cloudinary URL
  // Example: https://res.cloudinary.com/demo/upload/sample.jpg
  // Becomes: https://res.cloudinary.com/demo/upload/w_400,q_auto,f_auto/sample.jpg
  const transformations = `w_${width},q_${quality},f_${format}`;
  return url.replace('/upload/', `/upload/${transformations}/`);
}

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
