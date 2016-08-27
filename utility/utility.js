/**
 * Created by bhalker on 09/03/16.
 */

(function(){
    var uuid = require('node-uuid');
    var utilityObject = {};

    /*
            This function takes an array of objects and property based on which you want
             to sort the array
     */
    utilityObject.sort = function(arrayOfObjects, property){

        arrayOfObjects.sort(function(firstObj, secondObj){
            return firstObj[property] < secondObj[property];
        })

    };

/*
            cloudinary saves image as https://res.cloudinary.com/difxmbfp7/image/upload/v1472281922/SOMENAME.jpg
            And while calling delete api, it expects the SOMENAME in order to delete the image.
            Hence this function is required, which will return the SOMENAME (without the image extension)

 */
    utilityObject.findCloudinaryImageName = function (securePathUrl) {
        var regex = new RegExp("^(http|https)://"), imageName, imageExtension;     // validate that securePathUrl is actually URL
        // validate the securePath is url
        if(regex.test(securePathUrl)) {
            imageExtension = securePathUrl.substr(securePathUrl.lastIndexOf('.'));
            imageName = securePathUrl.substr(securePathUrl.lastIndexOf('/')+1);
            return imageName.substr(0,imageName.length - imageExtension.length);
        }
        return undefined;
    };

    /*
            Cloudinary assigns a unique name to image if, if image name is not provided while uploading.
            I would be good to provide image name from our end, in order to keep track in cloudinary dashboard.
            So this will create a unique image name, that would be
            username_uuid.generate()
     */
    utilityObject.generateImageName = function (user) {
        if(user) {
            return user+'_'+uuid.v1();
        }
        return undefined;
    };


    module.exports.utilityObject = utilityObject;

})();