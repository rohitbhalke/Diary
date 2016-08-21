/**
 * Created by bhalker on 29/12/15.
 */

// This will hold all the model for local, fb and twitter stratergy

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
    }
});


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);