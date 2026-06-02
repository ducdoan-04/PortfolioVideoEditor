const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove const apiUrl = ... lines
      content = content.replace(/const apiUrl\s*=\s*process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'http:\/\/localhost:3000';?\r?\n/g, '');
      
      // Replace ${apiUrl}/api/... with /api/...
      content = content.replace(/\$\{apiUrl\}\/api/g, '/api');
      
      // Replace fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/...`) with fetch('/api/...')
      content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\}\/api/g, '/api');
      
      // Replace `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${video.thumbnail_url}` with `${video.thumbnail_url}`
      content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'http:\/\/localhost:3000'\}\$\{([^}]+)\}/g, '${$1}');

      // Note: also handle `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${selectedVideo.thumbnail_url}`
      content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'http:\/\/localhost:3000'\}/g, '');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'app'));
processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'lib'));
console.log("Fixed all absolute API URLs to relative.");
