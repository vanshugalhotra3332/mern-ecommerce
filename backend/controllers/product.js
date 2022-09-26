const Product = require("../models/product");
const { NotFoundError } = require("../errors/index");
const ApiFeatures = require("../utils/apiFeatures");
const StatusCodes = require("http-status-codes");

// * Create Product --> Admin

const createProduct = async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body); // create new product from parameters recieved through request body

  res.status(200).json({
    success: true,
    product,
  });
};

// Get All Products

const getAllProducts = async (req, res) => {
  const resultPerPage = 2;

  const apiFeature = new ApiFeatures(req.query).search().filter();
  const queryObject = apiFeature.queryObject;
  const skip = apiFeature.pagination(resultPerPage);

  const totalProducts = await Product.countDocuments();

  const products = await Product.find(queryObject)
    .limit(resultPerPage)
    .skip(skip); // finding all the products that matches the queryObject parameters and limiting it
  res.status(StatusCodes.OK).json({
    success: true,
    totalProducts,
    shownProducts: products.length,
    products,
  });
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

  res.status(StatusCodes.OK).json({
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

  res.status(StatusCodes.OK).json({
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
  res.status(StatusCodes.OK).json({
    success: true,
    product,
  });
};

// Create new review or update the review
const createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find((rev) => {
    return rev.user == req.user.id;
  }); // == instead of === cuz we dont wanna match the datatype also

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user == req.user.id) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // changing the product rating
  let total_rating = 0;
  product.reviews.forEach((eachReview) => {
    total_rating += eachReview.rating;
  });

  product.rating = total_rating / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(StatusCodes.OK).json({
    success: true,
    product,
  });
};

// Get all product reviews

const getProductReviews = async (req, res) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    throw new NotFoundError(`No product with id: ${req.query.productId}`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    reviews: product.reviews,
  });
};

// delete review
const deleteReview = async (req, res) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    throw new NotFoundError(`No product with id: ${req.query.productId}`);
  }

  // getting every review to show, except for the one that is to be deleted
  const reviews = product.reviews.filter((eachReview) => {
    // every review in product.reviews array has its own unique id
    return eachReview._id != req.query.reviewId;
  });

  // changing the product rating
  let total_rating = 0;
  reviews.forEach((eachReview) => {
    total_rating += eachReview.rating;
  });

  const rating = total_rating / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      // passing the new data, which is changed when we deleted a review,
      reviews,
      rating, // overall rating of product
      numOfReviews,
    },
    {
      // extra options
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(StatusCodes.OK).json({
    success: true,
  });
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
};
