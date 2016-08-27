
var batProperties = require('../config/properties.js');

(function(){

    var assetServerObj = {};
    if(batProperties.assetServer == 'local' || batProperties.assetServer == 'remote') {
        assetServerObj.accountInfo = {
                cloud_name: 'difxmbfp7',
                api_key: '244366888197979',
                api_secret: '2gD82Cl4wrM0uXeQ669Ip8_OPxI'
        }
    }

    module.exports = assetServerObj;


})();
