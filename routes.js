const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter a message</title></head>');
    res.write(
      "<body><form action='/message' method='POST'><input id='message' type='text' name='message'><button type='submit'>Send</button></form></body>",
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
    // The "return" keyword here is important, because otherwise, Node will just register
    // these event listeners and simply execute the lines that follow after the end of
    // this function. Node acts asynchronously in this case.
    return req.on('end', () => {
      // here is where we do the buffering; "Buffer" is a globally-available object
      const parsedBody = Buffer.concat(reqBody).toString();
      const userInput = parsedBody.split('=')[1];

      // Since the .on method is asynchronous, we have to move this call into the on
      // method, otherwise, this will run before the on is registered. Also, we do not
      // want to use the writeFileSync method here since it blocks execution till the file
      // is created. In other words, if the file is not created when this line is executed,
      // Node will not run the code from this line onwards.
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
  // This response will be sent from the server only if the url has a /message in it
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page from Node.js</title></head>');
  res.write('<body><h1>Hello from my Node.js server!</h1></body>');
  res.write('</html>');
  res.end(); // this has to be called so that Node knows we are done creating the response
};

// Option 1: One way of exporting a function in Node.js; modue.exports is a global object exported by Node, and so it can work with this. With this, we can "import" this function in the app.js file with the "require" keyword, since requestHandler is being registered here in this fashion
module.exports = requestHandler;

// Option 2: Another way of exporting a function (and more than that) from this module - in an object
module.exports = {
  handler: requestHandler,
  someText: 'yo sup?',
};
