// schema model
// controller
// route

const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");
const authMiddleware = require("../middlewares/authentication");
// const validators = require("../middlewares/validators");

// const fileUpload = require("../helpers/upload.helper")("public/images/");
// const uploader = fileUpload.uploader;
// const { body, param } = require("express-validator");

/**
 * @route GET api/items?page=1&limit=10
 * @description Get items with pagination
 * @access Public
 */
router.get("/", itemController.getItems);

/**
 * @route GET api/items/:id
 * @description Get a single item
 * @access Public
 */
router.get("/:id", itemController.getSingleItem);

/**
 * @route POST api/items
 * @description Create a new item
 * @access Login required
 */
router.post(
  "/",
  //   authMiddleware.loginRequired,
  // uploader.array("images", 2),

  itemController.createNewItem
);

/**
 * @route PUT api/items/:id
 * @description Update a item
 * @access Login required
 */
router.put(
  "/:id",
  //   authMiddleware.loginRequired,

  itemController.updateSingleItem
);

/**
 * @route DELETE api/items/:id
 * @description Delete a item
 * @access Login required
 */
router.delete(
  "/:id",
  // authMiddleware.loginRequired,
  // validators.validate([
  //   param("id").exists().isString().custom(validators.checkObjectId),
  // ]),
  itemController.deleteSingleItem
);

/**
 * @route DELETE api/items/:id
 * @description Delete a item
 * @access Login required
 */


module.exports = router;
