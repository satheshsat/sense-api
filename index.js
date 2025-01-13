const express = require("express");
var cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
require("dotenv").config();
require('./config/db')();
const cookieparser = require('cookie-parser');
const tokenMiddleware = require('./middleware/token');

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
	limit: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

app.use(limiter);
app.use(hpp());
app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser()); 

app.use('/api/auth', require('./routes/auth'));

app.use('/api/users', tokenMiddleware.validateToken, require('./routes/users'));
app.use('/api/profile', tokenMiddleware.validateToken, require('./routes/profile'));

app.use('/api/adjustment', tokenMiddleware.validateToken, require('./routes/adjustment'));
app.use('/api/delivery', tokenMiddleware.validateToken, require('./routes/delivery'));
app.use('/api/jobcard', tokenMiddleware.validateToken, require('./routes/jobCard'));
app.use('/api/products', tokenMiddleware.validateToken, require('./routes/products'));
app.use('/api/partymaster', tokenMiddleware.validateToken, require('./routes/partyMaster'));
app.use('/api/purchase', tokenMiddleware.validateToken, require('./routes/purchase'));
app.use('/api/serviceentry', tokenMiddleware.validateToken, require('./routes/serviceEntry'));
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;