const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/product");
const { isLoggedIn, authorizeRole } = require("../middleware/authenticate");

const router = express.Router();

//* CREATING API Endpoints

// GET --> /api/v1/products
router.route("/products").get(isLoggedIn, getAllProducts);

// POST --> /api/v1/product/new
router
  .route("/admin/product/new")
  .post(isLoggedIn, authorizeRole("admin"), createProduct);

// PATCH --> /api/v1/product/:id
// DELETE --> /api/v1/product/:id
router
  .route("/admin/product/:id")
  .patch(isLoggedIn, authorizeRole("admin"), updateProduct)
  .delete(isLoggedIn, authorizeRole("admin"), deleteProduct);

// GET --> /api/v1/product/:id
router.route("/product/:id").get(getProductDetails);

module.exports = router;
