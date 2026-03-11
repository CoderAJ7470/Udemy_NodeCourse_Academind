## Section 3, Lesson 38

Node uses a single thread for the event loop.

The Node event loop:

1. Checks for timers (setTimeout or setInterval) that are executing functions
2. Checks any other pending callbacks

- Executes any I/O-related callbacks that were deferred
- I/O callbacks - disk and network (blocking ops)
- If there are too many such callback functions, Node will abort execution of all remaining callbacks and

3. Then enters a "poll" phase

- Where Node looks for new I/O events and does its best to exceute their own callbacks immediately if possible.
- If not possible, it will postpone the execution of I/O event callbacks, registering them as pending callbacks
- Node also checks for any "timer" callbacks (setTimeout/SetInterval), jumping to the timer phase and executing those callbacks

4. Then Node checks for any setImmediate callbacks in the "Check" phase

- Only gets executed after any callbacks have been executed

5. The next phase is the "Close" phase

- This is where any "close" event callbacks that were registered

6. Then the cycle might exit, only if there are no remaining registered event handlers to be called

- Internally, Node keeps track of all open event listeners -> refs (a counter variable)
- Each time Node encounters a new event listener, refs is incremented by 1
- It also decrements the refs counter by 1 whenever Node deems an event callback has been executed
- In a Node server environment, we explicitly create a server with http.createServer(). We listen with server.listen(), so there is always one event still executing (the listen event), thus we do not actually exit with process.exit(), in the usual Node.js manner. The only way to exit here is to stop the proces in the terminal.
