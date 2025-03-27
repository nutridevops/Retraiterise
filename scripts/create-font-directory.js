// This script creates the necessary directory structure for fonts
const fs = require("fs")
const path = require("path")

// Create fonts directory if it doesn't exist
const fontsDir = path.join(process.cwd(), "public", "fonts")
if (!fs.existsSync(fontsDir)) {
  console.log("Creating fonts directory...")
  fs.mkdirSync(fontsDir, { recursive: true })
  console.log("✅ Created directory: public/fonts")
} else {
  console.log("✅ Directory already exists: public/fonts")
}

