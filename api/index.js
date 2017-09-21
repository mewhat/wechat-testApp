var express = require('express');
var router = express.Router();
const personalTestApi = require('./personal-test/index.js');

/**
 * 微信js_code，授权
 */
// router.post('/', (req, res, next) => {
//     const appid = "";
//     const redirect_url = "";
// });

router.post('/personal/login', personalTestApi.login);
router.post('/personal/register', personalTestApi.register);
router.post('/personal/analysisTestRes', personalTestApi.analysisTestRes);
router.post('/personal/submitTestAnswer', personalTestApi.submitTestAnswer);
router.post('/personal/getTestPaperLists', personalTestApi.getTestPaperLists);
router.post('/personal/getTestPaper', personalTestApi.getTestPaper);

module.exports = router;