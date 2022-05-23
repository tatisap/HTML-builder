const path = require('path');
const fs = require('fs');

const secretPath = path.join(__dirname, 'secret-folder');

fs.readdir(
  secretPath,
  {withFileTypes: true},
  (error, files) => {
    if (error) return console.error(error.message);
    files.forEach(file => getFileInfo(file));
  }
);

function getFileInfo(file) {
  if (file.isDirectory()) return;

  const filePath = path.join(secretPath, file.name);
  const ext = path.extname(filePath).slice(1);
  const name = path.parse(filePath).name;
  
  fs.stat(
    filePath,
    (error, stats) => {
      if (error) return console.error(error.message);
      console.log(`${name} - ${ext} - ${stats.size}b`);
    }
  );
}