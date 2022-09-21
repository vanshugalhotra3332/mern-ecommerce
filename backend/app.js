const express = require("express");

require('express-async-errors'); // our error handler, 

const app = express();

const errorHandlerMiddleware = require("./middleware/errorHandler");

// route imports
const product = require("./routes/product");

// middlewares
app.use(express.json());
app.use("/api/v1", product); // api endpoint

app.use(errorHandlerMiddleware); // using error handler middleware

module.exports = app;
