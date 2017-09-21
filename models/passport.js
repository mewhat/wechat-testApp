const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
var db = require('./db.js');

module.exports = function(passport) {
    passport.use(new Strategy(
        function(token, done) {
            db.TeacherSchema.findOne({
                token: token
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
};
