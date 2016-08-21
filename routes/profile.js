/**
 * Created by bhalker on 29/04/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var loginSchema = require('../config/schema').loginSchema;

var Model = mongoose.model('test', loginSchema);


router.get('/', function(req, res, next) {
    console.log("Here", req.session.user.email);
    var backToHomeUrl = '/notes?email='+req.session.user.email;
    res.render('profile',{backToHomeUrl:backToHomeUrl});

});

router.post('/', function(req, res, next){
    var backToHomeUrl = '/notes?email='+req.session.user.email;
    var email = req.body.email,
        oldPassword = req.body.oldpassword,
        newPassword = req.body.newpassword;
    console.log(oldPassword, email);
    Model.findOne({
        $and: [
            {email: email},
            {password: oldPassword}
        ]
    }).exec(function (err, user) {

        if (user !== null) {
            user.password = newPassword;
            //user.visits.$inc();
            user.save();
            //req.logout();
            //res.render('tempLogin',{message:"Password Changed Succesfully"});
            res.redirect('/');
        }
        else {
            console.log("Wrong");
            res.render('profile',{backToHomeUrl:backToHomeUrl});
        }
    });
});

module.exports = router;