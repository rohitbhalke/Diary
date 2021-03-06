var express = require('express');
var mongoose = require('mongoose');
var cloudinary = require('cloudinary');
var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs');
var utility = require('../utility/utility');
var mv = require('mv');
var diarySchema = require('../config/schema').diarySchema;
var batProperties = require('../config/properties');
var Model = mongoose.model('diarySchema', diarySchema);

var router = express.Router();

router.get('/json', function (req, res, next) {

    Model.find({}, function (err, users) {
        var temp = [];
        res.json(users);
    })
});


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    console.log("Not authenticated");
    res.render('tempLogin', {message: "Please login to continue"});
}


router.get('/', isAuthenticated, function (req, res, next) {

    Model.findOne({'email': req.query.email}, function (err, note) {
        if (note === null) {
            res.json("Doesn't exists");
        }
        else if (err) {
            res.json("something went wrong");
        }
        else {
            utility.utilityObject.sort(note.notes, 'time');
            res.render('newIndex', {title: 'My Notes', data: note.notes, id: note.id});
        }
    });
});


var postToGraph = function (req, savePath, res) {
    var newNote = {
        "time": new Date(),
        "title": req.body.title,
        "description": req.body.description,
        "id": uuid.v1(),
        "imagePath": savePath || ""
    };
    var email = req.query.email;
    Model.findOne({'email': email}, function (err, note) {
        note.notes.push(newNote);
        note.save(function (err) {
            if (err)
                console.log("error", err);
            else {
                console.log("INass");
                res.redirect('/notes?email=' + email);
            }
        });

    });

};


router.post('/', function (req, res, next) {
    var self = this;

    if (req.files.photo.name) {
        var photo = req.files.photo;
        var uploadDate = new Date().toISOString();
        uploadDate = uploadDate.replace(".", "").replace("_", "").replace(":", "");

        if (batProperties.assetServer === 'local') {  // Upload image to file system in image folder
            var tempPath = photo.path;

            var targetPath = path.join(__dirname, "../public/images/" + uploadDate + photo.name);
            var savePath = "/images/" + uploadDate + photo.name;

            mv(tempPath, targetPath, function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("file moved");
                    postToGraph(req, savePath, res)
                }
            });
        }
        else if (batProperties.assetServer === 'remote') {  // upload image to cloudinary server
            var imageName = utility.utilityObject.generateImageName(req.query.email);
            cloudinary.uploader.upload(photo.path, function success(result) {
                console.log('success');
                var savePath = result.secure_url;
                postToGraph(req, savePath, res);
            }, {public_id: imageName});
        }
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
         Now remove the image from file system/assetServer if there is any
         */
        if (deletedNote && deletedNote[0]) {
            var obj = deletedNote[0];
            if (obj["imagePath"]) {
                /*if (batProperties.assetServer === 'local') {
                    var targetPath = path.join(__dirname, "../public/" + obj.imagePath);
                    fs.unlinkSync(targetPath);
                }
                else if (batProperties.assetServer === 'remote') {
                    deleteImageFromCloudinaryStorage(obj.imagePath);
                }*/
                deleteImage(obj);
            }
        }
        /*
         The note is deleted. Now save back the object in DB
         */
        foundObject.save(function (err, newNote) {
            if (err) console.log(err);
            else {
                console.log("Done");
            }
            return res.status(200).send('OK')
        });

    });


});

router.put('/', function (req, res) {
    var note = req.body;
    if (note.action !== 'removemedia') {
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
        removemedia(req, res);
    }
});

var removemedia = function (req, res) {
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

        /*if (batProperties.assetServer == 'local') {
            // remove the image from file storage
            var targetPath = path.join(__dirname, "../public/" + imagePath);
            fs.unlinkSync(targetPath);

        }
        else if (batProperties.assetServer === 'remote') {
            // remove the image from cloudinary server
            deleteImageFromCloudinaryStorage(imagePath);
        }
*/
        var obj = {
            'imagePath' : imagePath
        };
        deleteImage(obj);

        foundObject.save(function (err, newNote) {
            if (err) console.log(err);
            else {
                console.log("remove media success");
            }
            return res.status(200).send('OK');
        });

    });
};

function deleteImage (obj) {
    if (batProperties.assetServer === 'local') {
        var targetPath = path.join(__dirname, "../public/" + obj.imagePath);
        fs.unlinkSync(targetPath);
    }
    else if (batProperties.assetServer === 'remote') {
        deleteImageFromCloudinaryStorage(obj.imagePath);
    }
}


function deleteImageFromCloudinaryStorage(imagePath) {
    var imageName = utility.utilityObject.findCloudinaryImageName(imagePath);
    cloudinary.uploader.destroy(imageName, function success(result) {
        if(result.result === 'ok')
            console.log("Image deleted from cloudinary storage");
        else
            console.log('Cloudinary Server Error: '+ result.result );

    });

}

module.exports = router;

