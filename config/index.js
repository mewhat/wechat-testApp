module.exports = {
    port: 3000,
    session: {
        secret: 'wechat-application-server-you-can`t-see-this',
        key: 'red-sex-network',
        maxAge: 24 * 60 * 60 * 1000
    },
    mongodb: 'mongodb://127.0.0.1/schoolWechat'
};
