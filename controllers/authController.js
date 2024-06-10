/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const signup = async (req, res) => {
    // console.log('req.body = ', req.body);
    try {
        const { name, password, email } = req.body; // সব সময় req.body থেকে object destructuring এর মাধ্যমে প্রয়োজনীয় property destructure করে ব্যবহার করব
        // যাতে পরবর্তীতে কি কি properties ব্যবহার করতেছো, তা জানার জন্য front-end ঘাটাঘাটি না করতে হয়
        // express module টি দেখেই যাতে বুঝতে পারি যে কি কি properties নিয়ে কাজ করতেছি

        if (!name?.trim()) {
            return res.status(500).json({ message: 'Name is required' });
        }
        // trim() method call করার কারণ হচ্ছে express/nodejs extra specingকে ও valid character হিসেবে count করে
        // return করার কারণ হচ্ছে if codition fullfail হলে code execution যেন ওখানেই হয়, পরবর্তী লাইনে যেন না যায়
        if (!email?.trim()) {
            return res.status(500).json({ message: 'email is required' });
        }

        if (!password || password?.trim().length < 6) {
            return res.status(500).json({ message: 'password must have at least 6 characters' });
        }

        const isUserExists = await User.findOne({ email });
        if (isUserExists) {
            return res.status(500).json({
                message: 'user already exists with this email',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword });
        // console.log("newUser = ", newUser);
        const JsonWebToken = jwt.sign({ id:newUser._id }, process.env.SIGNATURE, {
            expiresIn: '24h',
        });
        res.status(200).json({
            name: name.trim(),
            email: email.trim(),
            isAdmin: false,
            accessToken: JsonWebToken,
        });
    } catch (error) {
        if (error?.message) {
            res.status(500).json({ message: error.message });
            console.log({ message: error.message });
        } else {
            res.status(500).json({ message: 'Signup failed!' });
            console.log({ message: 'Signup failed!' });
        }
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userFound = await User.findOne({ email });
        // console.log('email = ', email);
        // console.log('userFound = ', userFound);
        if (userFound) {
            const isValidPassword = await bcrypt.compare(password, userFound.password);
            if (isValidPassword) {
                const JsonWebToken = jwt.sign(
                    { id: userFound.id, name: userFound.name },
                    process.env.SIGNATURE,
                    {
                        expiresIn: '1h',
                    }
                );
                res.status(200).json({
                    name: userFound.name,
                    email: userFound.email,
                    isAdmin: userFound.isAdmin,
                    accessToken: JsonWebToken,
                });
            } else {
                res.status(401).json({
                    message: 'Authentication failed!',
                });
            }
        } else {
            res.status(500).json({
                message: 'No user found with this gmail',
            });
        }
    } catch (err) {
        res.status(401).json({
            message: 'Authentication failed!',
        });
    }
};

module.exports = { signup, login };
