const express = require("express");
const app = express();

// route imports
const product = require("./routes/product");

// middlewares
app.use(express.json());

app.use("/api/v1", product);

module.exports = app;
