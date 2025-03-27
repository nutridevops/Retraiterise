// This script checks if the Alta font files exist
const fs = require("fs")
const path = require("path")

// Check if font files exist
const fontsDir = path.join(process.cwd(), "public", "fonts")
const woff2Path = path.join(fontsDir, "alta.woff2")
const woffPath = path.join(fontsDir, "alta.woff")

console.log("Checking for Alta font files...")

if (!fs.existsSync(fontsDir)) {
  console.log("❌ Font directory does not exist: public/fonts")
  console.log("Creating directory...")
  fs.mkdirSync(fontsDir, { recursive: true })
  console.log("✅ Created directory: public/fonts")
} else {
  console.log("✅ Font directory exists: public/fonts")
}

if (fs.existsSync(woff2Path)) {
  console.log("✅ Found alta.woff2")
} else {
  console.log("❌ Missing alta.woff2")
}

if (fs.existsSync(woffPath)) {
  console.log("✅ Found alta.woff")
} else {
  console.log("❌ Missing alta.woff")
}

if (!fs.existsSync(woff2Path) || !fs.existsSync(woffPath)) {
  console.log("\nPlease follow the instructions in FONT-INSTALLATION.md to install the Alta font.")
}

