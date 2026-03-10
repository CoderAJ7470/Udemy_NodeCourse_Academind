// Importing the requestHandler function from our local routes.js file
const routes = require('./routes'); // Can't just say 'routes' since routes.js is not a global module

// Importing the http module from Node, and assigning it to a constant, from which we can access any of the module's methods
const http = require('http');
const port = 3000;

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

const server = http.createServer(routes);

// listens for incoming requests on the given port, in this case, 8080
server.listen(port, () => console.log(`Server running on port ${port}...`));
