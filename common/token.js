const jwt = require('jsonwebtoken');

// 创建token
const createToken = (data, secret, time) => {
    return jwt.sign(data, secret, {
        expiresIn: time
    });
}

// 解析token
const parseToken = (token, secret) => {
    return jwt.verify(token, secret);
}

module.exports = {
    createToken: createToken,
    parseToken: parseToken
};