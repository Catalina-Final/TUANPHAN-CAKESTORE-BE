const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");

const Order = require("../models/Order");

const orderController = {};

orderController.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  console.log(orders);

  return sendResponse(res, 200, true, { orders }, null, "");
});

module.exports = orderController;
