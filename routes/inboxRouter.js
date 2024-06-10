// external imports
const express = require("express");

// internal imports
const {
  searchUser, addConversation, getConversations, sendMessage
} = require("../controllers/inboxController");
const checkLogin = require('../middlewares/common/checkLogin');

const router = express.Router();

// inbox page
// search user for conversation
router.get("/search/:searchText", checkLogin, searchUser);
router.get("/conversations", checkLogin, getConversations);
router.post("/conversation", checkLogin, addConversation);
router.post("/message", checkLogin, sendMessage);


module.exports = router;
