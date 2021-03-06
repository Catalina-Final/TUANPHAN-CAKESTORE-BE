var express = require("express");
var router = express.Router();

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// itemApi
const itemApi = require("./item.api");
router.use("/items", itemApi);

module.exports = router;
