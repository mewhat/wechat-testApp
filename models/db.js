const mongoose = require('mongoose');
const init = require('./init');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

/**
 * Student
 */
const StudentSchema = new Schema({
    id: String, // 学生学号；验证长度
    name: String, // 学生姓名；验证中文
    sex: String, // 用户性别： 性别man and woman
    class: String, // 学生班级，下拉列表；筛选数据
    // 学生不需要登录，只需要提供学生信息，以上必填
    value: String, // 
    type: String
});

/**
 * Teacher
 */
const TeacherSchema = new Schema({
    id: String, // 唯一标识
    name: String,// name可为空
    pwd: String, // 用户密码 加密
    class: String, // 教师班级，获取学生数据
    token: String, // 教师需要登录，需要验证登录，
});

// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
TeacherSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('pwd') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.pwd, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.pwd = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
// 校验用户输入密码是否正确
TeacherSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.pwd, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

/**
 * 试题
 */
const TestPaperSchema = new Schema({
    id: String,
    type: String,
    author: String,
    decription: String,
    question: Array,
    answer: Array
});

/**
 * 统一字段对象
 */
const Models = {
    Student: mongoose.model('Student', StudentSchema), // 定义学生
    Teacher: mongoose.model('Teacher', TeacherSchema), // 定义老师
    TestPaper: mongoose.model('TestPaper', TestPaperSchema), // 定义测试题
    // 数据库初始化字段
    initialized: false
};

// 初始化数据库
const initialize = function() {
    Models.Student.find(null, function(err, doc) {
        if (err) {
            console.log(err);
        } else if (!err) {
            if (!doc.length) {
                console.log('database first time open! 数据库首次创建')
                Promise.all(init.map(item => new Models[item.type](item).save())) // 初始化init.json中的数据
                    .then(() => console.log('数据库初始化成功'))
                    .catch(() => console.log('数据库出错'))
            }
            else {
                console.log('数据库再次连接成功');
            }
        } else {
            Models.initialized = true
        }
    });
};

mongoose.connect('mongodb://127.0.0.1/schoolWechat')

const db = mongoose.connection;

db.on('error', function() {
    console.log('数据库连接出错')
});

db.once('open', function() {
    console.log('数据库连接成功')
    initialize()
});

module.exports = Models;