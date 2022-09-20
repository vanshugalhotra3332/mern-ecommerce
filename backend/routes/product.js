const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
} = require("../controllers/product");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/product/new").post(createProduct);

router.route("/product/:id").patch(updateProduct);

module.exports = router;
