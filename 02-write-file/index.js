const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('\nHi! I am waiting for your input' +
'\nDo not forget to press Enter if you want to save a text fragment into a file text.txt' +
'\nPress Ctrl+C or enter keyword "exit" to finish writing to text.txt\n\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  writableStream.write(data);
});

process.on('exit', () => stdout.write('\nData has been written to text.txt\nHave a nice day!\n'));
process.on('SIGINT', () => process.exit());


