(function(){

    /*


            'db' --> Where to point database
                values  1) local   --->   Means access local db
                        2) remote  --->   Means access mlab db (mongolab)

             'assetServer' --> Where to upload files
                values  1) local   --->   Means upload images to local db
                        2) remote  --->   Means upload images to (cloudinary)


     */

    var BatProperties = {
        'db' : 'remote',
        'assetServer' : 'remote'
    };

    module.exports = BatProperties;

})();