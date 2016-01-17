/**
 * Created by bhalker on 26/10/15.
 */
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;


var Schema = mongoose.Schema;


var diarySchema = new Schema({
    "password" : String,
    "email" : String
},{ collection: 'databaseNotes' });


var Model = mongoose.model('test',diarySchema);

var router = express.Router();



/*
router.get('/', function(req, res, next) {
    res.render('login',{title:"Login Page"});
});
*/

router.get('/', function(req, res, next) {
    res.render('tempLogin');
});


router.get('/create', function(req,res,next){
   res.render('createNew',{title:"Create New User"});
});

router.post('/create',function(req,res,next) {

    var userName, email, password, entry={}, url, name;
    name = req.body.username;
    userName = req.body.username;
    email = req.body.email;
    password = req.body.password;
    console.log(userName,email,password);
    //res.redirect('http://localhost:5000/create');
    // check if user with email id already exists
    Model.findOne({'email':email},function(err, user){
        if(user){
            console.log("USER EXISTS ALREADY");
            res.json("exists already");
        }
        else{
            entry.name = userName;
            entry.email = email;
            entry.password = password;
            entry.notes = [];
            entry.notes.push({ "id" : "first", "time" : new Date(), "title" : "Welcome "+name, "description" : "Start Noting" });
            var conn = mongoose.connection;
            conn.collection('databaseNotes').insert(entry); // add to database
            url = 'notes?' + 'email='+email;
            res.redirect(url);
        }
    });
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


// facebook stratergy
passport.use('local-facebook',new FacebookStrategy({
        clientID: '157489637950875',
        clientSecret: '28befb061596207c5ec7b61fa3f12ec3',
        //callbackURL: "http://localhost:5000/auth/facebook/callback",
        //callbackURL: "http://192.168.2.9:5000/auth/facebook/callback",
        callbackURL: "http://139.126.244.35:5000/auth/facebook/callback",
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var entry = {};
        /*
            Here check wheter the user is already present, if yes then send that user
            else create new user and insert it
         */
        Model.findOne({'facebookId':profile.id},function(err, user){

            if(err){
                return done(err);
            }

            if(user){
                return done(null, user);
            }
            else {
                console.log(profile);
                entry.facebookId = profile.id;
                entry.email = profile.emails[0].value;
                entry.name = profile.name.givenName;
                entry.notes = [];
                entry.notes.push({ "id" : "Wooh", "time" : new Date(), "title" : "Welcome "+profile.name.givenName +" "+profile.name.familyName, "description" : "Start Noting" });
                var conn = mongoose.connection;
                conn.collection('databaseNotes').insert(entry); // add to database
                return done(null, entry);
            }

        });


        //return done(null, profile);
    }
));

router.get('/auth/facebook', passport.authenticate('local-facebook', { scope : ['email'] }));

// redirect for facebook and handle it here
router.get('/auth/facebook/callback',function (req, res, next) {
    passport.authenticate('local-facebook', function (err, user, info) {
        var url = "";
        if (err) {
            res.redirect(url);
        }
        if (user) {
            url += '/notes?' + 'email=' + user.email;
            res.redirect(url);
        }

    })(req, res, next);
});

/*
 The Passport JS "Google" page is recommending passport-google which is based on OpenID
 which I understand Google is deprecating.
 The page should be updated, probably to prefer passport-google-oauth.

passport.use('local-google',new GoogleStrategy({
        returnURL: 'http://localhost:5000/auth/google/return',
        realm: 'http://localhost:5000'
    },
    function(identifier, profile, done) {
        console.log(profile);
    }
));

router.get('/auth/google',passport.authenticate('local-google'));

router.get('/auth/google/return',function (req, res, next){
    passport.authenticate('local-facebook', function (err, user, info) {

    });
});
*/


//local stratergy
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

            if ( user !== null) {
                //url += 'notes?' + 'email='+userName;
                //res.redirect(url);
                return done(null, user);
            }
            else {
                return done(null, false);
                //res.redirect(url);
            }


        });
    }
));



router.post('/', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        var url = "",
            message="user doesn't exists";

        //var url = 'http:/localhost:5000/'
        if (err) {
            res.redirect(res.req.url);
        }
        else if(user===false){
            res.redirect(res.req.url);
        }
        else if (user) {
            url += '/notes?' + 'email=' + user.email;
            res.redirect(url);
        }

    })(req, res, next);
});

// Login post without passport
/*
router.post('/',function(req,res,next) {

    var userName = req.body.email,
        password = req.body.password,
        url = 'http://localhost:5000/';

    Model.findOne({
        $and: [
            {email: userName},
            {password: password}
        ]
    }).exec(function (err, user) {

        if (user) {
            url += 'notes?' + 'email='+userName;
            res.redirect(url);
        }
        else {
            res.redirect(url);
        }
    });
});
*/

module.exports = router;
