const jwt = require('jsonwebtoken');
require('dotenv').config();

const decodeToken = (headers) => {
    const { authorization } = headers;
    const token = authorization.split(' ')[1];
    return jwt.decode(token);
};

module.exports = { decodeToken };