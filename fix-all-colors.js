const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'frontend', 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const hasGreen1 = content.includes('#75A29E');
    const hasGreen2 = content.includes('#5C8581');
    const hasGreen3 = content.includes('#EBF3F2');

    if (hasGreen1 || hasGreen2 || hasGreen3) {
      content = content.replace(/#75A29E/ig, '#E84C3D');
      content = content.replace(/#5C8581/ig, '#C0392B');
      content = content.replace(/#EBF3F2/ig, '#FDEBD0');
      fs.writeFileSync(filePath, content);
      console.log('Fixed colors in:', filePath);
    }
  }
});
