exports.responseObj = (code, msg, data, time, user) => {
    const obj = {};
    obj.code = code;
    obj.msg = msg || '';
    obj.data = data || '';
    obj.time = time ? new Date(time).getTime() : new Date().getTime();
    obj.user = user;
    return obj;
};