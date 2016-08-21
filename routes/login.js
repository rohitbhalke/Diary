/**
 * Created by bhalker on 26/10/15.
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var passportLocal = require('../config/passport');
var passportFacebook = require('../config/passportFacebookStratergy');

router.get('/', function(req, res, next) {
    console.log("Login Get");
    res.render('tempLogin');
});


passport.serializeUser(function(user, done) {
    console.log("serialize");
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log("DE deserialize");
    done(null, user);
});

router.get('/auth/facebook', passportFacebook.authenticateFacebook({scope:['email']}));

// redirect for facebook and handle it here
router.get('/auth/facebook/callback',function (req, res, next) {
    passport.authenticate('local-facebook', function (err, user, info) {
        var url = "";
        if (err) {
            res.redirect(url);
        }
        if (user) {
            req.session.user = user;
            url += '/notes?' + 'email=' + user.email;
            res.redirect(url);
        }

    })(req, res, next);
});




//local stratergy

router.post('/', function (req, res, next) {
    passportLocal.authenticateLocal(req,res,next);
});


function logout(req, res, next){
    if(req.isAuthenticated()){
        req.logout();
    }
    res.redirect('/');
}


router.get('/logout', logout, function(req,res,next){
    console.log("Logged Out succesfully");

});

module.exports = router;

