var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');


var routes = require('./routes/index');
var users = require('./routes/users');
var create = require('./routes/create');
var login = require('./routes/login');
var profile = require('./routes/profile');
var mongoose = require('mongoose');

var batProperties = require('./config/properties.js');
console.log('##################### DATABASE IN '+ batProperties.db + " ASSET SERVER IN : "+ batProperties.assetServer+"  ######################");
var configDB = require('./config/database.js');
var cloudinaryDB = require('./config/cloudinary');
var multipart = require('connect-multiparty');
var cloudinary = require('cloudinary');

// configure database here

console.log("Connecting TO database");
mongoose.connect(configDB.url);
console.log("Connection Success");
cloudinary.config(cloudinaryDB.accountInfo);
console.log("cloudinary asset server confib success");
//require('./config/passport.js')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use( multipart() );
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());
app.use(session({ secret: 'olhosvermelhoseasenhaclassica',saveUninitialized:true,resave:true ,maxAge:null })); //session secret
app.use(passport.initialize());
app.use(passport.session());


app.use('/notes', routes);
app.use('/users', users);
app.use('/create', create);
app.use('/',login);
app.use('/profile',profile);


//require('./routes/login.js')(app, passport); // load our routes and pass in our app and fully configured passport
//require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport
//require('./routes/users.js')(app, passport); // load our routes and pass in our app and fully configured passport
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
