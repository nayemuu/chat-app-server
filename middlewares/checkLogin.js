const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkLogin = (req, res, next) => {
    // console.log('req.headers = ', req.headers);
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.SIGNATURE);
        next();
    } catch {
        res.status(401).json({
            message: 'Authentication failed!',
        });
    }
};

module.exports = checkLogin;
