// Importing the http module from Node, and assigning it to a constant, from which we can access any of the module's methods
const http = require('http');
const fs = require('fs');

//function requestListener(req, res) {}

// createServer takes a requestListener
// http.createServer(requestListener);

// Above can also be written as below with an anonymous function
// http.createServer(function(req, res) {});

// Or like so:
// const server = http.createServer((req, res) => {
//   console.log(req.url, req.method, req.headers);

//   // To stop the server's event loop, we can call process.exit(),
//   // but usually, this is not the way we stop the server
//   // process.exit()
// });

const server = http.createServer((req, res) => {
  // console.log(req.url, req.method, req.headers);

  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter a message</title></head>');
    res.write(
      "<body><form action='/message' method='POST'><input id='message' type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write('</html>');
    return res.end(); // this has to be called so that Node knows we are done creating the response
  }

  if (url === '/message' && method === 'POST') {
    const reqBody = [];

    req.on('data', (chunk) => {
      console.log('got ', chunk);
      reqBody.push(chunk);
    });

    // Executes when the incoming request parsing has been completed
    // The first "return" keyword is important, because otherwise, Node will just register
    // these event listeners and simply execute the lines that follow after the end of
    // this function
    return req.on('end', () => {
      // here is where we do the buffering; "Buffer" is a globally-available object
      const parsedBody = Buffer.concat(reqBody).toString();
      const userInput = parsedBody.split('=')[1];

      fs.writeFile('message.txt', userInput, (error) => {
        if (error) {
          return console.log('Error: ', error);
        }

        res.statusCode = 302; // 302 = redirect
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  // Here, we are sending back our own response
  // Sending back some html, which has to typed
  // line-by-line, in this weird manner
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page from Node.js</title></head>');
  res.write('<body><h1>Hello from my Node.js server!</h1></body>');
  res.write('</html>');
  res.end(); // this has to be called so that Node knows we are done creating the response
});

// listens for incoming requests on the given port, in this case, 8080
server.listen(8080);
