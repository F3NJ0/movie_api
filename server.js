/* Importing http, url, and fs module */
const http = require('http'),
  url = require('url'),
  fs = require('fs');

/* Creating http server that listens on port 8080 */
http.createServer((request, response) => {
  /* Parsing request url and storing in variable q */
  let addr = request.url;
  q = url.parse(addr, true),
  filePath = '';

  /* Storing request address and timestamp in log.txt file */
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.txt.');
    }
  });

  /* Setting file path to documentation.html file if pathname includes documentation,
  otherwise to index.html */
  if (q.pathname.includes('documentation')){
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  /* Reading and returning the respective file from filePath */
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();
  });
}).listen(8080);

console.log('My first Node server is running on port 8080.');
