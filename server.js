const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// global middleware
function bouncer(req, res, next) {
  res.status(404).json("Theres are not the droids you are looking for");
}

function teamNamer(req, res, next) {
  req.team = "Web XVII"; // middleware can modify the request
  next(); // go ahead and execute the next middleware route handler
}

// return 403 and 'you shall not pass!' when clock seconds multiples 3, other times call next()
function notPass(req, res, next) {
  // or new Date().getSeconds()
  const seconds = new Date().getSeconds();
  console.log(seconds);
  seconds % 3 === 0 ? res.status(403).send("you shall not pass!") : next();
}
// server.use(bouncer);
server.use(express.json());
server.use(helmet()); // 3rd party, need to npm install or yarn add
server.use(teamNamer);
// server.use(notPass);

// routing
server.use("/api/hubs", hubsRouter);

// route handlers ARE middleware
server.get("/", restricted, (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} the Lambda Hubs API</p>
    `);
});

function restricted(req, res, next) {
  const password = req.headers.password;

  if (password === "mellon") {
    next();
  } else {
    res.status(401).send("you shall not pass");
  }
}

module.exports = server;
