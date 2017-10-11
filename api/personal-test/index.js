var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();
var db = require('../../models/db.js');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');
const config = require('../../config/index');
const tokenParser = require('../../common/token.js');
const respObj = require('../../common/utils.js');

require('../../models/passport.js')(passport);

/**
 * 登录
 */
exports.login = (req, res) => {
    const user = req.body;
    if (user.id && user.pwd) {
        db.Teacher.findOne({ id: user.id }, (err, resp) => {
            if (err) {
                throw err;
            } else {
                if (resp) {
                    // 检查密码是否正确
                    resp.comparePassword(user.pwd, (err, isMatch) => {
                        if (isMatch && !err) {
                            // 密码正确，设置登录的token
                            var token = jwt.sign({ name: resp.name }, config.session.secret, {
                                expiresIn: 60 * 60 * 1000
                            });
                            const params = {
                                token: 'Bearer ' + token,
                                id: resp.id
                            }
                            res.send(respObj.responseObj(0, 'success', params));
                        } else {
                            res.send(respObj.responseObj(-1, '密码错误!'));
                        }
                    });
                } else {
                    res.send(respObj.responseObj(200, '用户不存在'));
                }
            }
        });
    } else {
        res.send(respObj.responseObj(100, '参数错误'));
    }
};

/**
 * 注册
 */
exports.register = (req, res) => {
    const user = req.body;
    if (user.id && user.pwd && user.class) {
        db.Teacher.findOne({ id: user.id, class: user.class }, (err, resp) => {
            if (err) {
                throw err;
            } else {
                if (resp) {
                    res.send(respObj.responseObj(200, '用户已经存在'));
                } else {
                    const teacher = new db.Teacher({
                        id: user.id,
                        pwd: user.pwd,
                        class: user.class,
                        name: '',
                        token: ''
                    });
                    teacher.save(error => {
                        if (error) {
                            throw error;
                        } else {
                            res.send(respObj.responseObj(0, 'success'));
                        }
                    });
                }
            }
        });
    } else {
        res.send(respObj.responseObj(100, '参数错误'));
    }
};


/**
 * 获取班级统计数据
 */
exports.analysisTestRes = (req, res) => {
    const user = req.body; // 获取教师id，得到班级class
    if (user.id) {
        db.Teacher.findOne({id: user.id }, (err, doc) => {
            if (err) {
                throw err;
            } else {
                if (doc) {
                    db.Student.find({ class: doc.class }, (error, data) => {
                        if (error) {
                            throw error;
                        } else {
                            if (data && data.length) {
                                res.send(respObj.responseObj(0, 'success', data));
                            } else {
                                res.send(respObj.responseObj(0, '没有数据', []));
                            }
                        }
                    });
                } else {
                    res.send(respObj.responseObj(100, '老师不存在'));
                }
            }
        });
    } else {
        res.send(respObj.responseObj(100, '参数不对'));
    }
};

/**
 * 提交答案
 */
exports.submitTestAnswer = (req, res) => {
    const user = req.body;
    if (user.id && user.class && (user.value.toString()) && user.type && user.name) {
        db.Student.findOne({ id: user.id, class: user.class }, (error, data) => {
            if (error) {
                throw error;
            } else {
                if (data) {
                    db.Student.findOneAndUpdate({ id: user.id, class: user.class }, { $set: { value: user.value, type: user.type } }, (err, doc) => {
                        if (err) {
                            throw err;
                        } else {
                            res.send(respObj.responseObj(0, 'success'));
                        }
                    });
                } else {
                    const student = new db.Student({
                        id: user.id,
                        class: user.class,
                        value: user.value,
                        type: user.type,
                        sex: '',
                        name: user.name || ''
                    });
                    student.save(error2 => {
                        if (error2) {
                            throw error2;
                        } else {
                            res.send(respObj.responseObj(0, 'success'));
                        }
                    });
                }
            }
        });
        
    } else {
        res.send(respObj.responseObj(100, '参数不对'));
    }
};

/**
 * 获取题库列表
 */
exports.getTestPaperLists = (req, res) => {
    const user = req.body;
    if (user.id) {
        // db.Teacher.findOne({ id: user.id }, (err, doc) => {
        //     if (err) {
        //         throw err;
        //     } else {
        //         if (doc) {
                    db.TestPaper.find(null, (err_paper, paper) => {
                        if (err_paper) {
                            throw err_paper;
                        } else {
                            let arr = [];
                            _.each(paper, (item) => {
                                const params = {};
                                params.id = item.id;
                                params.type = item.type;
                                params.author = item.author;
                                params.description = item.description;
                                params.question = item.question;
                                arr.push(params);
                            });
                            res.send(respObj.responseObj(0, 'success', arr));
                        }
                    });
        //         } else {
        //             res.send(respObj.responseObj(200, '老师不存在'));
        //         }
        //     }
        // });
    } else {
        res.send(respObj.responseObj(100, '参数不对'));
    }
};

/**
 * 获取测试题目
 */
exports.getTestPaper = (req, res) => {
    const user = req.body;
    if (user.id) {
        const pageSize = user.pageSize;
        const pageNum = user.pageNum;
        db.TestPaper.findOne({ id: user.id }, (err, doc) => {
            if (err) {
                throw err;
            } else {
                if (doc) {
                    const obj = {};
                    obj.description = doc.description;
                    obj.question = doc.question;
                    obj.id = doc.id;
                    if (Object.keys(obj).length) {
                        res.send(respObj.responseObj(0, 'success', obj));
                    } else {
                        res.send(respObj.responseObj(200, '数据出错', obj));
                    }
                } else {
                    res.send(respObj.responseObj(200, '试题不存在'));
                }
            }
        });
    } else {
        res.send(respObj.responseObj(100, '参数不对'));
    }
};

