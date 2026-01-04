/**
 * Icon Generation Script
 * 
 * This script generates PWA icons from the source SVG.
 * Run with: node scripts/generate-icons.js
 * 
 * Requires: sharp (npm install sharp --save-dev)
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Creating placeholder icons instead.');
  console.log('To generate proper icons, run: npm install sharp --save-dev');
  console.log('Then run this script again.\n');
  
  // Create simple placeholder message
  const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  
  console.log('Icons directory:', iconsDir);
  console.log('Please add your own PNG icons or install sharp to generate them.');
  
  process.exit(0);
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const svgPath = path.join(__dirname, '..', 'public', 'icons', 'icon.svg');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

async function generateIcons() {
  console.log('Generating PWA icons from SVG...\n');
  
  const svgBuffer = fs.readFileSync(svgPath);
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated: icon-${size}x${size}.png`);
  }
  
  // Also create apple-touch-icon (180x180)
  const appleTouchPath = path.join(outputDir, 'apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);
  
  console.log(`✓ Generated: apple-touch-icon.png`);
  
  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
