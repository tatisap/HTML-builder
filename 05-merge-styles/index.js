const path = require('path');
const fs = require('fs');

const srcPath = path.join(__dirname, 'styles');

fs.readdir(
  srcPath,
  {withFileTypes: true},
  (error, files) => {
    if (error) console.error(error.message);
    
    const streamWritable = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    streamWritable.on('error', error => console.error(error.message));

    files.forEach(file => {
      const filePath = path.join(srcPath, file.name);
      if (file.isDirectory() || path.extname(filePath) !== '.css') return;

      const streamReadable = fs.createReadStream(path.join(srcPath, file.name));
      streamReadable.on('error', error => console.error(error.message));

      streamReadable.pipe(streamWritable);
    });
  }
);