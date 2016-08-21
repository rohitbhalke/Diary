
(function(){

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;


    var Model = mongoose.model('test');

    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Facebook stratergy
    passport.use('local-facebook',new FacebookStrategy({
                clientID: '157489637950875',
                clientSecret: '28befb061596207c5ec7b61fa3f12ec3',
                //callbackURL: "http://localhost:5000/auth/facebook/callback",
                //callbackURL: "http://192.168.2.9:5000/auth/facebook/callback",
                callbackURL: "http://192.168.2.12:5000/diary/auth/facebook/callback",
                profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
            },
        function(accessToken, refreshToken, profile, done) {
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

            }
    ));

    var authenticateFacebook = function(){
        return passport.authenticate('local-facebook', { scope : ['email'] });
    }

    module.exports.authenticateFacebook = authenticateFacebook;

})();