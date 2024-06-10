
const User = require('../models/userModel');
const Conversation = require('../models/Conversation');
const {decodeToken} = require('../utils/jwt-utils');
const { replaceMongoIdInArray } = require('../utils/mongoDB-utils');
const mongoose = require('mongoose');


// inbox
async function getConversations(req, res, next) {
  // console.log("yoo");

  const { id } = decodeToken(req.headers);
  console.log("id = ", id);
  
  // console.log("id = ", new  mongoose.Types.ObjectId(id));

  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator": id},
        { "participant": id },
      ],
    }).populate("creator", "name email").populate("participant", "name email").lean();
    // console.log("conversations = ", conversations);

    res.status(200).json({
      conversations: replaceMongoIdInArray(conversations),
    });
  }  catch (error) {
    console.log("error = ", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

// search user
async function searchUser(req, res, next) {
  const { id } = decodeToken(req.headers);
  // console.log("id = ", id);

  const searchText = req.params.searchText;
  // console.log("searchText = ", searchText);
  if (!searchText?.trim()) {
    return res.status(500).json({ message: 'No Search Text found'});
}
const regex = new RegExp(searchText, "i");

  try {

      const users = await User.find(
        {
          $or: [
            {
              name: regex,
            },
            {
              email: regex,
            },
          ],
        },
        "name email" 
      ).lean();
    
      // console.log("users = ", users);

      const modifiedUsers = replaceMongoIdInArray(users).filter(user=> user.id !== id);
      
      // console.log("modifiedUsers = ", modifiedUsers);

      res.status(200).json({users: modifiedUsers});
    
  } catch (error) {
    // console.log("error = ", error);
    res.status(500).json({
      message: error.message,
    });
  }
}
// add conversation
async function addConversation(req, res, next) {  
  const { id } = decodeToken(req.headers);
  // console.log("req.body = ", req.body);

  try {

    const sender = await User.findOne(
      {_id: id},
      "email name" 
    ).lean();
    // console.log("sender = ", sender);

    if(!req.body.to.trim()){
      return res.status(400).json({
        message: "Please, Provide valid information",
      })
    }
    

    const reciever = await User.findOne(
      {email: req.body.to.trim()},
      "email name" 
    ).lean();
    
    // console.log("reciever = ", reciever);

    if(!reciever){
      return res.status(400).json({
        message: "No user found with this email",
      })
    }

    
    
    const newConversation = new Conversation({
      creator: sender._id,
      participant: reciever._id,
    });

    const result = await newConversation.save();
    // console.log("result = ", result);
    res.status(201).json({
      message: "Conversation was added successfully!",
    });
  } catch (error) {
    // console.log("error = ", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

async function sendMessage(req, res, next){  
  const { id } = decodeToken(req.headers);
  // console.log("req.body = ", req.body);

  try {

    const sender = await User.findOne(
      {_id: id},
      "email name" 
    ).lean();
    // console.log("sender = ", sender);

    if(!req.body.to.trim()){
      return res.status(400).json({
        message: "Please, Provide valid information",
      })
    }
    

    const reciever = await User.findOne(
      {email: req.body.to.trim()},
      "email name" 
    ).lean();
    
    // console.log("reciever = ", reciever);

    if(!reciever){
      return res.status(400).json({
        message: "No user found with this email",
      })
    }

    
    let conversationId = null;

    const isConversationAlreadyExists = await Conversation.findOne(
      {
        $or: [
          { "creator": sender._id, "participant": reciever._id },
          { "creator": reciever._id, "participant": sender._id },
        ],
      }
    ).lean();

    if(isConversationAlreadyExists){
      // console.log("Conversation Already exist");
      conversationId = isConversationAlreadyExists._id.toString();
      // console.log("conversationId = ", conversationId);
    }else{
      // console.log("No Conversation Found");
      const newConversation = new Conversation({
        creator: sender._id,
        participant: reciever._id,
      });

      const result = await newConversation.save();

      // console.log("newConversation = ", newConversation);
      // console.log("result = ", result);
      conversationId = result._id.toString();
    }

    console.log("conversationId = ", conversationId);

    res.status(200).json({
      message: "success",
    });

    


    
  } catch (error) {
    // console.log("error = ", error);
    res.status(500).json({
      message: error.message,
    });
  }
}


module.exports = {
  getConversations, searchUser, addConversation, sendMessage
};
