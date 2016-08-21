
(function(){
    var express = require('express');
    var mongoose = require('mongoose');
    var login = require('../routes/login');
    var Schema = mongoose.Schema;


    var Model = mongoose.model('test');

    var router = express.Router();

    router.get('/', function(req,res,next){
        res.render('createNew',{title:"Create New User"});
    });

    router.post('/',function(req,res,next) {

        var userName, email, password, entry={}, url, name;
        name = req.body.username;
        userName = req.body.username;
        email = req.body.email;
        password = req.body.password;
        console.log(userName,email,password);
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
                res.redirect("/");
            }
        });
    });

    module.exports = router;

})();