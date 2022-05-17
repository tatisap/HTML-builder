const path = require('path');
const fs = require('fs');

function copyDir(dir) {
  fs.mkdir(
    path.join(__dirname, `${dir}-copy`),
    { recursive: true },
    error => {
      if (error) console.error(error.message);
      copyFiles(dir);
    }
  );
}

function copyFiles(dir) {
  fs.readdir(
    path.join(__dirname, dir),
    {withFileTypes: true},
    (error, files) => {
      if (error) console.error(error.message);

      files.forEach(file => {
        if (file.isDirectory()) return;
        fs.copyFile(
          path.join(__dirname, dir, file.name),
          path.join(__dirname, `${dir}-copy`, file.name),
          error => {
            if (error) console.error(error.message);
          }
        );
      });
    }
  );
}

copyDir('files');