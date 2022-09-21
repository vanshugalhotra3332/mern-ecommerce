const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/product");

const router = express.Router();


//* CREATING API Endpoints

// GET --> /api/v1/products
router.route("/products").get(getAllProducts); 

// POST --> /api/v1/product/new
router.route("/product/new").post(createProduct);

// PATCH --> /api/v1/product/:id
router.route("/product/:id").patch(updateProduct);

// DELETE --> /api/v1/product/:id
router.route("/product/:id").delete(deleteProduct);

// GET --> /api/v1/product/:id
router.route("/product/:id").get(getProductDetails);

module.exports = router;
