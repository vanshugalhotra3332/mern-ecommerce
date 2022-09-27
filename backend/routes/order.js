const express = require("express");
const { isLoggedIn, authorizeRole } = require("../middleware/authenticate");

const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");

const router = express.Router();

// POST -- /api/v1/order/new
router.route("/order/new").post(isLoggedIn, createOrder);

// GET --> /api/v1/orders/me
router.route("/orders/me").get(isLoggedIn, myOrders);

// GET --> /api/v1/orders/:id
router.route("/order/:id").get(isLoggedIn, getSingleOrder);

//-------------------------------------------------ADMIN Routes ------------------------------------------------------------------------------------------------------------------

// GET --> /api/v1/admin/orders
router
  .route("/admin/orders")
  .get(isLoggedIn, authorizeRole("admin"), getAllOrders);

// PATCH --> /api/v1/admin/order/:id
// DELETE --> /api/v1/admin/order/:id
router
  .route("/admin/order/:id")
  .patch(isLoggedIn, authorizeRole("admin"), updateOrder)
  .delete(isLoggedIn, authorizeRole("admin"), deleteOrder);

module.exports = router;
