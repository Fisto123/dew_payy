export function isValidImageLink(link) {
  // Implement your own validation logic for image links
  // You might use regular expressions or other checks based on your requirements
  // For simplicity, this function currently checks if the link starts with 'http' or 'https'
  return /^https?:\/\//.test(link);
}
