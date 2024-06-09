// external imports
const express = require("express");

// internal imports
const {
  searchUser, addConversation, getConversation
} = require("../controllers/inboxController");
const checkLogin = require('../middlewares/common/checkLogin');

const router = express.Router();

// inbox page
// search user for conversation
router.get("/search/:searchText", checkLogin, searchUser);
router.get("/conversation", checkLogin, getConversation);
router.post("/conversation", checkLogin, addConversation);


module.exports = router;
