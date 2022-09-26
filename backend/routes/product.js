/**
 * Note: This must be kept in mind while creating routes
 *
 * Lets say I have a
 *    GET request at,
 *    /api/v1/product/:id
 *
 *    which will give me details about the product
 *    with give id
 *
 * And I have a another
 *     GET request at,
 *     /api/v1/product/reviews
 *
 *     which will get me product reviews,
 *
 * * Now the problem is , when I will access the 2nd one, the request will be send on first url, with id=reviews, and we will get CastError
 * 
 * So there must be no clashes with such request, so must plan before making the APIs
 */

const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/product");
const { isLoggedIn, authorizeRole } = require("../middleware/authenticate");

const router = express.Router();

//* CREATING API Endpoints

// GET --> /api/v1/products
router.route("/products").get(isLoggedIn, getAllProducts);

// GET --> /api/v1/products/:id
router.route("/products/:id").get(getProductDetails);

// PATCH --> /api/v1/product/review
router.route("/product/review").patch(isLoggedIn, createProductReview);

// GET --> /api/v1/product/reviews?productId
// DELETE --> /api/v1/product/reviews?productId=?reviewId=
router
  .route("/product/reviews")
  .get(getProductReviews)
  .delete(isLoggedIn, deleteReview);

// -----------------------------ADMIN Routes ---------------------------------------------------------------

// POST --> /api/v1/admin/product/new
router
  .route("/admin/product/new")
  .post(isLoggedIn, authorizeRole("admin"), createProduct);

// PATCH --> /api/v1/admin/product/:id
// DELETE --> /api/v1/admin/product/:id
router
  .route("/admin/product/:id")
  .patch(isLoggedIn, authorizeRole("admin"), updateProduct)
  .delete(isLoggedIn, authorizeRole("admin"), deleteProduct);

module.exports = router;
