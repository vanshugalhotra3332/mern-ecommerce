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

// GET --> /api/v1/product/:id
router.route("/product/:id").get(getProductDetails);

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
