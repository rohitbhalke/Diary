/*
/!**
 * Created by bhalker on 29/12/15.
 *!/

// load all the things we need
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User = require('../model/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-login',new LocalStrategy({
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

                if (user) {
                    //url += 'notes?' + 'email='+userName;
                    //res.redirect(url);
                }
                else {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    //res.redirect(url);
                }

                return done(null, user);
            });
        }
    ));

};*/
