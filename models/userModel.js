/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            minLength: 6,
            maxLength: 40,
        },

        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 6,
        },
        
        avatar: {
            type: String,
        },
        
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
          },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
