const { createCanvas } = require('canvas');
const fs = require('fs');

// Function to create an icon with black background and white WK
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Set up text styling
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Scale font size based on canvas size
  const fontSize = Math.floor(size * 0.25);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;

  // Draw W
  const centerX = size / 2;
  const centerY = size / 2;
  const letterSpacing = size * 0.12;
  
  ctx.fillText('W', centerX - letterSpacing, centerY);

  // Draw divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = Math.max(2, size * 0.006);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - size * 0.15);
  ctx.lineTo(centerX, centerY + size * 0.15);
  ctx.stroke();

  // Draw K
  ctx.fillStyle = '#ffffff';
  ctx.fillText('K', centerX + letterSpacing, centerY);

  return canvas;
}

// Generate different sized icons
const sizes = [192, 512];
const maskableSizes = [192, 512];

// Create regular icons
sizes.forEach(size => {
  const canvas = createIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icon-${size}x${size}.png`, buffer);
  console.log(`Created icon-${size}x${size}.png`);
});

// Create maskable icons (same design but ensuring it works with masks)
maskableSizes.forEach(size => {
  const canvas = createIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icon-maskable-${size}x${size}.png`, buffer);
  console.log(`Created icon-maskable-${size}x${size}.png`);
});

console.log('All icons generated successfully!');

// Clean up the script
fs.unlinkSync('generate-icons.js');
console.log('Cleaned up generation script.');
