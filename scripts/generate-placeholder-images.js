const fs = require('fs');
const path = require('path');

// Create the team directory if it doesn't exist
const teamDir = path.join(__dirname, '../public/images/team');
if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

// Generate simple SVG placeholder images for organizers
const organizers = [
  {
    filename: 'laetitia-lusakivana.jpg',
    initials: 'LL',
    bgColor: '#0A291C',
    textColor: '#FFFFFF'
  },
  {
    filename: 'sandra-leguede.jpg',
    initials: 'SL',
    bgColor: '#0A291C',
    textColor: '#FFFFFF'
  },
  {
    filename: 'chris-massamba.jpg',
    initials: 'CM',
    bgColor: '#0A291C',
    textColor: '#FFFFFF'
  }
];

// Generate SVG placeholder for each organizer
organizers.forEach(org => {
  const svgContent = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${org.bgColor}" />
  <text x="200" y="200" font-family="Arial" font-size="120" text-anchor="middle" dominant-baseline="middle" fill="${org.textColor}">${org.initials}</text>
</svg>
  `.trim();
  
  // Convert SVG to base64 for embedding in HTML
  const base64 = Buffer.from(svgContent).toString('base64');
  
  // Create a simple HTML file that will display the SVG
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${org.initials} Placeholder</title>
  <style>
    body { margin: 0; padding: 0; }
    img { width: 100%; height: 100%; object-fit: contain; }
  </style>
</head>
<body>
  <img src="data:image/svg+xml;base64,${base64}" alt="${org.initials} Placeholder">
</body>
</html>
  `.trim();
  
  // Write the HTML file
  fs.writeFileSync(path.join(teamDir, org.filename.replace('.jpg', '.html')), htmlContent);
  
  // Also write the SVG directly
  fs.writeFileSync(path.join(teamDir, org.filename.replace('.jpg', '.svg')), svgContent);
  
  console.log(`Generated placeholder for ${org.filename}`);
});

console.log('All placeholder images generated successfully!');
