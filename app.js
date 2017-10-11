var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
const morgan = require('morgan'); // 命令行log显示
const passport = require('passport');// 用户认证模块passport
const Strategy = require('passport-http-bearer').Strategy;// token验证模块
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://127.0.0.1/schoolWechat';
var db = require('./models/db.js');
var config = require('./config/index.js');

var app = express();
var api = require('./api/index.js');

app.use(passport.initialize());// 初始化passport模块
app.use(morgan('dev'));// 命令行中显示程序运行日志,便于bug调试
// 设置静态文件目录
// app.use(express.static(path.join(__dirname, '../dist')));
app.use(cookieParser());
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,// 强制更新 session
    saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge,// 过期时间，过期后 cookie 中的 session id 自动删除
        secure: false
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));
// 表单解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * 设置允许运行跨域
 * allow custom header and CORS
 */
app.all('*',function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, OPTIONS");
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", '3.2.1')

    if (req.method == 'OPTIONS') {
        res.sendStatus(200); /*让options请求快速返回*/
    }
    else {
        next();
    }
});

/**
 * 使用api 监听路由
 * 添加路由需要在api/index.js里面添加
 */
app.use('/api', api);

/**
 * 暴露静态资源
 */
// app.get('*', function(req, res) {
//     const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
//     res.send(html);
// });

// 监听端口
app.listen(8000);
console.log('success listen at port:8000......');