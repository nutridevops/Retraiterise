// This is a Node.js script to help set up the Alta font
// Run with: node scripts/setup-fonts.js

const fs = require("fs")
const path = require("path")
const https = require("https")
const { execSync } = require("child_process")

// Create fonts directory if it doesn't exist
const fontsDir = path.join(process.cwd(), "public", "fonts")
if (!fs.existsSync(fontsDir)) {
  console.log("Creating fonts directory...")
  fs.mkdirSync(fontsDir, { recursive: true })
}

console.log(`
=============================================
Alta Font Setup Guide
=============================================

1. Download the Alta font from: https://dafontfile.com/alta-font/

2. Extract the downloaded file and locate the font files (likely .ttf or .otf format)

3. Convert the font to web formats using one of these tools:
   - Font Squirrel Generator: https://www.fontsquirrel.com/tools/webfont-generator
   - Transfonter: https://transfonter.org/

4. Place the converted files in the public/fonts directory:
   - public/fonts/alta.woff2
   - public/fonts/alta.woff

5. Restart your development server

The Alta font will now be applied to all headings on your website.
=============================================
`)

// Check if font files exist
const woff2Path = path.join(fontsDir, "alta.woff2")
const woffPath = path.join(fontsDir, "alta.woff")

if (fs.existsSync(woff2Path) && fs.existsSync(woffPath)) {
  console.log("✅ Alta font files already exist in public/fonts directory.")
} else {
  console.log("❌ Alta font files not found. Please follow the steps above to set up the font.")
}

