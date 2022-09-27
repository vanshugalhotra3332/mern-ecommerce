const Order = require("../models/order");
const Product = require("../models/product");
const StatusCodes = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");

// Create new Order
const createOrder = async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.id,
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    order,
  });
};

// get Single Order
const getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  ); // instead of getting id of the user, populate function will go to the user model and get the name and email of the corresponding user

  if (!order) {
    throw new NotFoundError(`No Order with id: ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    order,
  });
};

// get logged in user Orders

const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(StatusCodes.OK).json({
    success: true,
    orders,
  });
};

// get all orders ---> ADMIN

const getAllOrders = async (req, res) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((eachOrder) => {
    totalAmount += eachOrder.totalPrice;
  });

  res.status(StatusCodes.OK).json({
    success: true,
    totalOrders: orders.length,
    totalAmount,
    orders,
  });
};

// update order status ---> ADMIN
const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new NotFoundError(`No Order with id: ${req.params.id}`);
  }

  if (order.orderStatus === "Delivered") {
    throw new BadRequestError("Order already delivered");
  }

  order.orderItems.forEach(async (eachOrder) => {
    await updateStock(eachOrder.product, eachOrder.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(StatusCodes.OK).json({
    success: true,
    order,
  });

  async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
  }
};

// Delete order

const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  await order.remove();

  if (!order) {
    throw new NotFoundError(`No Order with id: ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Order Deleted successfully!",
  });
};

module.exports = {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
