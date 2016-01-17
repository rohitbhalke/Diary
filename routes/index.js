var express = require('express');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var diarySchema = new Schema({
    "name": String,
    "password": String,
    "email": String,
    "notes": [{
        "id": String,	// use this as static now future: convert it to add random for each doc
        "time": Date,
        "title": String,
        "description": String
    }]
}, {collection: 'databaseNotes'});


var Model = mongoose.model('diarySchema', diarySchema);


var router = express.Router();


router.get('/json', function (req, res, next) {

    Model.find({}, function (err, users) {
        var temp = [];
        res.json(users);
    })
});


router.get('/', function (req, res, next) {
    console.log(req);

    Model.findOne({'email': req.query.email}, function (err, note) {
        if (note === null) {
            res.json("Doesn't exists");
        }
        else if (err) {
            res.json("something went wrong");
        }
        else
            res.render('index', {title: 'My Notes', data: note.notes.reverse(), id: note.id});
    });
    /*Model.find({},function(err,users){
     var temp = [];
     res.render('index', { title: 'My Notes', data: users[0].notes.reverse(), id:users[0].id});
     //res.json(users);
     })*/
});

router.post('/', function (req, res, next) {


    var newNote = {
        "time": new Date(),
        "title": req.body.title,
        "description": req.body.description,
        "id": uuid.v1()
    }, updatedNode = {};

    var email = req.query.email;


    Model.findOne({'email': email}, function (err, note) {

        note.notes.push(newNote);
        note.save(function (err) {
            if (err)
                console.log("error", err);
            else
                res.redirect('/notes?email=' + email);
        });

    });

});

router.delete('/', function (req, res) {

    var note = req.body;
    var email = req.query.email;
    var id = note.id;
    var noteId = note.customId;

    Model.findOne({_id: id}, function (err, foundObject) {
        if (err) {

            return res.status(500).send();
        }
        var arr = foundObject.notes;
        for (var item in arr) {
            if (noteId == arr[item]["id"]) {
                arr.splice(item, 1);

            }
        }

        foundObject.save(function (err, newNote) {
            if (err) console.log(err);
            else
                console.log("Done");

            //res.req.method = 'get';
            //res.redirect('/notes?email='+email);
            return res.status(200).send('OK')
        });

    });


});

router.put('/', function (req, res) {
    var note = req.body;
    var email = req.query.email;
    var id = note.id;
    var noteId = note.customId;

    Model.findOne({_id: id}, function (err, foundObject) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        var arr = foundObject.notes;
        for (var item in arr) {
            if (noteId == arr[item]["id"]) {
                arr[item]["time"] = note.time;
                arr[item]["title"] = note.title;
                arr[item]["description"] = note.description;

            }
        }

        foundObject.save(function (err, newNote) {
            if (err) console.log(err);
            else
                return res.status(200).send('OK')

        });

    });

});

module.exports = router;
