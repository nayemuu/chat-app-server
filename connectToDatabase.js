require('dotenv').config();
const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DATABASEADDRESS);
        console.log('connection success');
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectToDatabase;
