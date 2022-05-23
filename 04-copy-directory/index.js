const path = require('path');
const fs = require('fs');
const folderName = 'files';
const from = path.join(__dirname, `${folderName}`);
const to = path.join(__dirname, `${folderName}-copy`);

copyDir(from, to);

function copyDir(from, to) {
  fs.rm(
    to,
    { force: true, recursive: true },
    error => {
      if (error) return console.error(error.message);
      
      fs.mkdir(
        to,
        { recursive: true },
        error => {
          if (error) return console.error(error.message);
          copyFiles(from, to);
        }
      );
    }
  );
}

function copyFiles(from, to) {
  fs.readdir(
    from,
    {withFileTypes: true},
    (error, files) => {
      if (error) return console.error(error.message);

      files.forEach(file => {
        if (file.isDirectory()) {
          copyDir(path.join(from, file.name), path.join(to, file.name));
        } else {
          fs.copyFile(
            path.join(from, file.name),
            path.join(to, file.name),
            error => {
              if (error) return console.error(error.message);
            }
          );
        }
      });
    }
  );
}