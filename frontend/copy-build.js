const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

const srcDir = path.join(__dirname, 'out');
const destDir = path.join(__dirname, '../backend/public');

try {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  if (fs.existsSync(srcDir)) {
    copyFolderSync(srcDir, destDir);
    console.log('Frontend build successfully copied to backend/public!');
  } else {
    console.error('Error: "out" directory not found. Run "npm run build" first.');
  }
} catch (error) {
  console.error('Error copying build files:', error);
}
