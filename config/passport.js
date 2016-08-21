

(function(){
    var mongoose = require('mongoose')
    var loginSchema = require('../config/schema').loginSchema;

    var Model = mongoose.model('test', loginSchema);

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    //local stratergy
    var useLocal = passport.use('local-login',new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            Model.findOne({
                $and: [
                    {email: username},
                    {password: password}
                ]
            }).exec(function (err, user) {

                if ( user !== null) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
        }
    ));

    var authenticateLocalStratergy =function(req,res,next){
        passport.authenticate('local-login', function (err, user, info) {
            var url = "",
                message="user doesn't exists";

            if (err) {
                console.log("err");
                res.redirect('/');
            }
            else if(user===false){
                console.log("false");
                res.render('tempLogin',{message:"Wrong Credentials"});
            }
            else
            {
                req.logIn(user,function(err){
                    if(err){
                        console.log("HERE");
                        res.redirect('/',{message:"Invalid credentials"});
                    }
                    else{
                        req.session.user = user;
                        url += '/notes?' + 'email=' + user.email;
                        res.redirect(url);
                    }

                })
            }

        })(req, res, next);

    };

    module.exports.authenticateLocal = authenticateLocalStratergy;

}());