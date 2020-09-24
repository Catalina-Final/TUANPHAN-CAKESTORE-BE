const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
// const { emailHelper } = require("../helpers/email.helper");
const utilsHelper = require("../helpers/utils.helper");
const FRONTEND_URL = process.env.FRONTEND_URL;
const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, avatarUrl, password } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return next(new AppError(409, "User already exists", "Register Error"));

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  // const emailVerificationCode = utilsHelper.generateRandomHexString(20);
  //   const emailVerificationCode = await bcrypt.hash(email, salt);
  user = await User.create({
    name,
    email,
    password,
    avatarUrl,
    // emailVerificationCode,
    emailVerified: true,
  });
  const accessToken = await user.generateToken();

  // const verificationURL = `${FRONTEND_URL}/verify/${emailVerificationCode}`;
  // const emailData = await emailHelper.renderEmailTemplate(
  //   "verify_email",
  //   { name, code: verificationURL },
  //   email
  // );
  // if (!emailData.error) {
  //   emailHelper.send(emailData);
  // } else {
  //   return next(new AppError(500, emailData.error, "Create Email Error"));
  // }

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

userController.verifyEmail = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  let user = await User.findOne({
    emailVerificationCode: code,
  });
  if (!user) {
    return next(
      new AppError(400, "Invalid Verification Code", "Verify Email Error")
    );
  }
  user = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { emailVerified: true },
      $unset: { emailVerificationCode: 1 },
    },
    { new: true }
  );
  const accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const allows = ["name", "password", "avatarUrl"];
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError(404, "Account not found", "Update Profile Error"));
  }

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update Profile successfully"
  );
});

userController.addToCart = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const { productID, quantity } = req.body;

  let user = await User.findById(userId);

  user = user.toJSON();
  const item = user.cart.find((product) => product.item.equals(productID));
  if (item) {
    user.cart = user.cart.map((product) => {
      if (!product.item.equals(productID)) return product;
      return { ...product, quantity: product.quantity + quantity };
    });
  } else {
    user.cart = [...user.cart, { item: productID, quantity }];
  }

  console.log(user.cart);
  user = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { cart: user.cart },
    },
    { new: true }
  ).populate("cart.item");

  return sendResponse(
    res,
    200,
    true,
    user.cart,
    null,
    "Add to cart successful"
  );
});

userController.deleteItem = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const productID = req.params.id;

  let user = await User.findById(userId);

  user = user.toJSON();
  user.cart = user.cart.filter((product) => !product.item.equals(productID));

  console.log(user.cart);
  user = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { cart: user.cart },
    },
    { new: true }
  );

  return sendResponse(res, 200, true, null, null, "Remove item successful");
});

userController.updateQuantity = catchAsync(async (req, res, next) => {
  const cart = req.body;
  console.log(req.body);

  return sendResponse(res, 200, true, cart, null, "Update quantity successful");
});

userController.checkout = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  let user = await User.findById(userId).populate("cart.item", "title price");
  console.log(user.cart);
  // let totalPrice = 0;
  // user.cart.map((cartItem) => {
  //   totalPrice = cartItem.item.price * cartItem.quantity + totalPrice;
  // });

  let totalPrice = user.cart.reduce(
    (num, item) => num + item.item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: userId,
    products: user.cart,
    totalPrice,
  });
  if (!order) {
    return next(new AppError(400, "Create Order failed", "Checkout Error"));
  }
  // remove cart in user
  await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
  return sendResponse(res, 200, true, order, null, "Check out successful");
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate("cart.item");
  // if (user.cart && user.cart.length > 0) {
  //   User.populate(user, { path: "cart.item" });
  // }
  console.log(user.cart[0]);
  return sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "Get current user successful"
  );
});

userController.deleteCart = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findByIdAndUpdate(userId, {
    cart: [],
  });
  return sendResponse(res, 200, true, null, null, "Delete Cart successful");
  
});

module.exports = userController;
