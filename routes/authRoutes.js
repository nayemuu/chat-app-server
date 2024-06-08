/* eslint-disable consistent-return */
/* eslint-disable max-len */
const express = require('express');
const { signup, login } = require('../controllers/authController');
const checkLogin = require('../middlewares/checkLogin');

const Route = express.Router();
Route.post('/signup', signup);
Route.post('/login', login);
Route.get('/test', checkLogin, (req, res) => {
    res.send({ data: 'This is private route. This means, you have successfully logged in' });
});

module.exports = Route;
