
const User = require('../models/userModel');
const {decodeToken} = require('../utils/jwt-utils');
const { replaceMongoIdInArray } = require('../utils/mongoDB-utils');


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


module.exports = {
  searchUser
};
