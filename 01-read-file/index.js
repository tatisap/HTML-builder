const path = require('path');
const fs = require('fs');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let fileContent = '';

stream.on('data', data => fileContent += data);
stream.on('end', () => console.log(fileContent));
stream.on('error', error => console.error(error.message));

