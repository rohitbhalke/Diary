/**
 * Created by bhalker on 29/12/15.
 */

var batProperties = require('../config/properties.js');

<!-- will hold our database connection settings -->

/*
module.exports = {


    'url' : 'mongodb://localhost/databaseNotes' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    //'url' : 'mongodb://rohit:rohit@ds013216.mlab.com:13216/privatediary'
};
*/


(function(){

    var dbObj = {};
    if(batProperties.db == 'local') {
        dbObj.url = 'mongodb://localhost/databaseNotes';
    }

    if(batProperties.db == 'remote') {
        dbObj.url = 'mongodb://rohit:rohit@ds013216.mlab.com:13216/privatediary';
    }

    module.exports = dbObj;
})();