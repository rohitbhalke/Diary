
(function(){
/*
        This holds all the schema required
 */

var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var diarySchema = new Schema({
     "name": String,
     "password": String,
     "email": String,
     "notes": [{
         "id": String,
         "time": Date,
         "title": String,
         "description": String,
         "imagePath": String
     }]
 }, {collection: 'databaseNotes'});


 var loginSchema = new Schema({
     "password" : String,
     "email" : String
 },{ collection: 'databaseNotes' });


 module.exports.loginSchema =  loginSchema;
 module.exports.diarySchema = diarySchema;

})();