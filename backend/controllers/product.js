const Product = require("../models/product");

// * Create Product

const createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
};

const getAllProducts = (req, res) => {
  res.status(200).json({ message: "Route is working" });
};

module.exports = { getAllProducts, createProduct };
