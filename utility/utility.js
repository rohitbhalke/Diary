/**
 * Created by bhalker on 09/03/16.
 */

(function(){

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


    module.exports.utilityObject = utilityObject;

})();