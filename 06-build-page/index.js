const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

fs.rm(
  distPath,
  { force: true, recursive: true },
  error => {
    if (error) return console.error(error.message);
    build();
  }
);
    
function build() {
  fs.mkdir(
    distPath,
    { recursive: true },
    error => {
      if (error) return console.error(error.message);

      buildHtml();
      
      buildCss();
      
      copyDir(assetsPath, path.join(distPath, 'assets'));
    }
  );
}

function buildHtml() {
  let content = '';
  let tagNames = [];

  const readableHtmlStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  readableHtmlStream.on('data', (data) => content += data);
  readableHtmlStream.on('error', (error) => console.error(error.message));
  
  readableHtmlStream.on('end', () => {   
    
    tagNames = content.match(/{{([^\s]+)}}/g);
      
    Promise.all(
      tagNames.map(name => {
        const stream = fs.createReadStream(path.join(componentsPath, `${name.replace(/[{}]/g, '')}.html`), 'utf-8');
  
        return new Promise((resolve, reject) => {
          let basket = '';
          stream.on('data', (data) => basket += data);
          stream.on('end', () => resolve({name: path.parse(stream.path).name, content: basket}));
          stream.on('error', (error) => reject(error));
        });
      })
    )
      .then((values) => {
        values.forEach(value => content = content.replace(`{{${value.name}}}`, value.content));
  
        const writableHtmlStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
        writableHtmlStream.write(content);
      })
      .catch((error) => console.error(error.message));
  });
}

function buildCss() {
  fs.readdir(
    stylesPath,
    {withFileTypes: true},
    (error, files) => {
      if (error) return console.error(error.message);
      
      const streamWritable = fs.createWriteStream(path.join(distPath, 'style.css'));
      streamWritable.on('error', error => console.error(error.message));
  
      Promise.all(
        files.map(file => {
          const filePath = path.join(stylesPath, file.name);
          if (file.isDirectory() || path.extname(filePath) !== '.css') return;
  
          const streamReadable = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
          
          return new Promise((resolve, reject) => {
            let basket = '';
            streamReadable.on('data', (data) => basket += data);
            streamReadable.on('end', () => resolve(basket));
            streamReadable.on('error', (error) => reject(error));
          });
        })
      )
        .then(values => {
          values.forEach(value => streamWritable.write(`${value}\n`));
        })
        .catch((error) => console.error(error.message));
    }
  );
}

function copyDir(from, to) {
  fs.mkdir(
    to,
    { recursive: true },
    error => {
      if (error) return console.error(error.message);
      copyFiles(from, to);
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