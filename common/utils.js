exports.responseObj = (code, msg, data, time, user) => {
    const obj = {};
    obj.code = code; // 返回数据状态，0：成功，100：参数错误，200：用户不存在，-1：密码错误
    obj.msg = msg || ''; // 提示信息
    obj.data = data || ''; // 返回的数据
    obj.time = time ? new Date(time).getTime() : new Date().getTime(); // 返回数据的时间戳
    obj.user = user; // 使用接口的用户 一般没有这个只有前面几个
    return obj;
};