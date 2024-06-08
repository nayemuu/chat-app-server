// external imports
const express = require("express");

// internal imports
const {
  searchUser,
} = require("../controllers/inboxController");
const checkLogin = require('../middlewares/common/checkLogin');

const router = express.Router();

// inbox page
// search user for conversation
router.get("/:searchText", checkLogin, searchUser);


module.exports = router;
