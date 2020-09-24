const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const Item = require("../models/item");
// const Review = require("../models/Review");
const itemController = {};

itemController.getItems = catchAsync(async (req, res, next) => {
  //   let { page, limit, sortBy, ...filter } = { ...req.query };
  //   page = parseInt(page) || 1;
  //   limit = parseInt(limit) || 10;

  //   const totalItems = await Item.countDocuments({
  //     ...filter,
  //     isDeleted: false,
  //   });
  //   const totalPages = Math.ceil(totalItems / limit);
  //   const offset = limit * (page - 1);

  // console.log({ filter, sortBy });
  const items = await Item.find();

  // .sort({ ...sortBy, createdAt: -1 })
  // .skip(offset)
  // .limit(limit)

  return sendResponse(res, 200, true, { items }, null, "");
});

itemController.getSingleItem = catchAsync(async (req, res, next) => {
  let item = await Item.findById(req.params.id);
  if (!item)
    return next(new AppError(404, "Item not found", "Get Single Item Error"));
  item = item.toJSON();
  // item.reviews = await Review.find({ item: item._id }).populate("user");
  return sendResponse(res, 200, true, item, null, null);
});

itemController.createNewItem = catchAsync(async (req, res, next) => {
  const { title, content, price, imgSrc } = req.body;
  //   let { images } = req.body;
  // if (req.files) {
  //   images = req.files.map((file) => {
  //     return file.path.split("public")[1].split("\\").join("/");
  //   });
  // }

  const item = await Item.create({
    title,
    content,
    price,
    imgSrc,
    // images,
  });

  return sendResponse(res, 200, true, item, null, "Create new item successful");
});

itemController.updateSingleItem = catchAsync(async (req, res, next) => {
  const itemId = req.params.id;
  const { title, content, price, imgSrc } = req.body;

  const item = await Item.findOneAndUpdate(
    { _id: itemId },
    { title, content, price, imgSrc },
    { new: true }
  );
  if (!item)
    return next(
      new AppError(
        400,
        "Item not found or User not authorized",
        "Update Item Error"
      )
    );
  return sendResponse(res, 200, true, item, null, "Update Item successful");
});

itemController.deleteSingleItem = catchAsync(async (req, res, next) => {
  const itemId = req.params.id;

  const item = await Item.findOneAndUpdate(
    { _id: itemId },
    { isDeleted: true },
    { new: true }
  );
  if (!item)
    return next(
      new AppError(
        400,
        "Item not found or User not authorized",
        "Delete Item Error"
      )
    );
  return sendResponse(res, 200, true, null, null, "Delete Item successful");
});

module.exports = itemController;
