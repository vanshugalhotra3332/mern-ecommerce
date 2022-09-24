const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/product");
const { Authenticate, authorizeRole } = require("../middleware/authenticate");

const router = express.Router();

//* CREATING API Endpoints

// GET --> /api/v1/products
router.route("/products").get(Authenticate, getAllProducts);

// POST --> /api/v1/product/new
router
  .route("/product/new")
  .post(Authenticate, authorizeRole("admin"), createProduct);

// PATCH --> /api/v1/product/:id
router
  .route("/product/:id")
  .patch(Authenticate, authorizeRole("admin"), updateProduct);

// DELETE --> /api/v1/product/:id
router
  .route("/product/:id")
  .delete(Authenticate, authorizeRole("admin"), deleteProduct);

// GET --> /api/v1/product/:id
router.route("/product/:id").get(getProductDetails);

module.exports = router;
