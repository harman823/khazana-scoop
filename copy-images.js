const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\harma\\.gemini\\antigravity\\brain\\ea792f15-e540-4585-b450-ba90acf31551';
const dstDir = path.join(__dirname, 'frontend', 'public', 'img', 'services');

fs.mkdirSync(dstDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));

files.forEach(f => {
  if (f.startsWith('ind_therapy')) fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, 'ind_therapy.png'));
  if (f.startsWith('adol_therapy')) fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, 'adol_therapy.png'));
  if (f.startsWith('emo_therapy')) fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, 'emo_therapy.png'));
  if (f.startsWith('rel_therapy')) fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, 'rel_therapy.png'));
  if (f.startsWith('rep_therapy')) fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, 'rep_therapy.png'));
  if (f.startsWith('stuck_therapy')) fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, 'stuck_therapy.png'));
});

console.log('Images copied successfully.');
