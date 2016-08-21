var express = require('express');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var multer	= require('multer');
var path = require('path');
var fs = require('fs');
var utility = require('../utility/utility');

var diarySchema = require('../config/schema').diarySchema;

var Model = mongoose.model('diarySchema', diarySchema);

var router = express.Router();

router.get('/json', function (req, res, next) {

    Model.find({}, function (err, users) {
        var temp = [];
        res.json(users);
    })
});

function isAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return next();
    console.log("not authenticated man");
    res.render('tempLogin',{message: "Please login to continue"});
}



router.get('/', isAuthenticated, function (req, res, next) {

    Model.findOne({'email': req.query.email}, function (err, note) {
        if (note === null) {
            res.json("Doesn't exists");
        }
        else if (err) {
            res.json("something went wrong");
        }
        else{
            utility.utilityObject.sort(note.notes,'time');
            res.render('newIndex', {title: 'My Notes', data: note.notes, id: note.id});
        }
    });
});


var postToGraph = function(req,savePath,res){
    var newNote = {
        "time": new Date(),
        "title": req.body.title,
        "description": req.body.description,
        "id": uuid.v1(),
        "imagePath" : savePath || ""
    };
    var email = req.query.email;
    Model.findOne({'email': email}, function (err, note) {
        note.notes.push(newNote);
        note.save(function (err) {
            if (err)
                console.log("error", err);
            else{
                console.log("INass");
                res.redirect('/notes?email=' + email);
            }
        });

    });

};


router.post('/', function(req, res, next){
    var self = this;
    var a = "aa";

    if(req.files.photo.name) {
        var photo = req.files.photo;
        var uploadDate = new Date().toISOString();
        uploadDate = uploadDate.replace(".", "").replace("_", "").replace(":", "");


        var tempPath = photo.path;
        var uploadDate = new Date().toISOString();

        var targetPath = path.join(__dirname, "../public/images/" + uploadDate + photo.name);
        var savePath = "/images/" + uploadDate + photo.name;

        fs.rename(tempPath, targetPath, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                postToGraph(req, savePath,res)
            }
        });
    }
    else {
        postToGraph(req, "", res);
    }
});

router.delete('/', function (req, res) {

    var note = req.body,
        email = req.query.email,
        id = note.id,
        noteId = note.customId,
        deletedNote;

    Model.findOne({_id: id}, function (err, foundObject) {
        if (err) {

            return res.status(500).send();
        }
        var arr = foundObject.notes;
        for (var item in arr) {
            if (noteId == arr[item]["id"]) {
                deletedNote = arr.splice(item, 1);
            }
        }

        /*
         Now remove the image from file system if there is any
         */

        var obj = deletedNote[0];
        if(obj["imagePath"]){
            var targetPath = path.join(__dirname, "../public/" + obj.imagePath);
            fs.unlinkSync(targetPath);
        }


        /*
         The note is deleted. Now save back the object in DB
         */
        foundObject.save(function (err, newNote) {
            if (err) console.log(err);
            else{
                console.log("Done");
            }
            return res.status(200).send('OK')
        });

    });


});

router.put('/', function (req, res) {
    var note = req.body;
    if(note.action!=='removemedia'){
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
                    arr[item]["time"] = new Date();
                }
            }

            foundObject.save(function (err, newNote) {
                if (err) console.log(err);
                else
                    return res.status(200).send('OK')

            });

        });
    }
    else {
        removemedia(req,res);
    }
});

var removemedia = function(req,res) {
    var objectId = req.body.objectId,
        imagePath = req.body.imagePath,
        noteId = req.body.noteId,
        email = req.query.email;

    Model.findOne({_id: objectId}, function (err, foundObject) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        var arr = foundObject.notes;
        for (var item in arr) {
            if (noteId == arr[item]["id"]) {
                arr[item]["imagePath"] = "";
            }
        }
        // remove the image from file storage
        var targetPath = path.join(__dirname, "../public/" + imagePath);
        fs.unlinkSync(targetPath);

        foundObject.save(function (err, newNote) {
            if (err) console.log(err);
            else{
                console.log("remove media success");
            }
            return res.status(200).send('OK');
        });

    });
};

module.exports = router;

