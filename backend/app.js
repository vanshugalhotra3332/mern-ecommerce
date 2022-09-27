const express = require("express");
require("express-async-errors"); // our error handler,
const cookieParser = require("cookie-parser");

const errorHandlerMiddleware = require("./middleware/errorHandler");

// route imports
const product = require("./routes/product");
const user = require("./routes/user");
const order = require("./routes/order");

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", product); // api endpoint
app.use("/api/v1", user); // api endpoint
app.use("/api/v1", order); // api endpoint

app.use(errorHandlerMiddleware); // using error handler middleware

module.exports = app;
