const Product = require("../models/product");
const { NotFoundError, CustomAPIError } = require("../errors/index");
const ApiFeatures = require("../utils/apiFeatures");

// * Create Product --> Admin

const createProduct = async (req, res, next) => {
  const product = await Product.create(req.body); // create new product from parameters recieved through request body

  res.status(200).json({
    success: true,
    product,
  });
};

// Get All Products

const getAllProducts = async (req, res) => {
  const apiFeature = new ApiFeatures(req.query);
  const queryObject = apiFeature.search().filter().queryObject;

  const products = await Product.find(queryObject); // finding all the products
  res.status(200).json({ success: true, products });
};

// Update Product --> Admin

const updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id); // finding the product based on id passed as url parameter
  if (!product) {
    // if product not found then throw error
    throw new NotFoundError(`No product with id: ${req.params.id}`);
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  }); // updating the product

  res.status(200).json({
    success: true,
    product,
  });
};
// Delete Product --> Admin

const deleteProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    throw new NotFoundError(`No product with id: ${req.params.id}`);
  }
  await product.remove();

  res.status(200).json({
    success: true,
    product,
    message: "Product deleted Successfully!",
  });
};

// Get single product

const getProductDetails = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    throw new NotFoundError(`No product with id: ${req.params.id}`);
  }
  res.status(200).json({
    success: true,
    product,
  });
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
};
