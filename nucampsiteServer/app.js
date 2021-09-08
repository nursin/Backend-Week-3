// importing third party middlewares
var createError = require('http-errors');
var express = require('express');
var path = require('path'); //core module built into nodejs
var logger = require('morgan');
const passport = require('passport');
const config = require('./config');

//importing local files
var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
// third party module
// create schemas and manipulate (CreateReadUpdateDelete) our mongoDB database
// without this middleware our express applicaiton cannot interact with out mongodb
//A way to automate requests (GET, POST, PUT, DELETE)
//also without this you would have to manualy manipulate mongodb which was showcased 
// during nodejs driver exercise
const mongoose = require('mongoose');

// decalring variable with name of our database
//in this case my database is "nucampsite"
const url = config.mongoUrl;

// mongoose middlewware will connect to our mongodb server
// and create this database called nucampsite if not exist
// this is equivalent to use db in nodejs driver
const connect = mongoose.connect(url, {
  // optional to get rid of erors when astarting app
  // why because some of these methods have been deprecated older version being used
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// a promise 
//with every mongoose method a promise will be returned
// if mongoose connects to the mongodb server properly the server will
//reply with the console.log
// otherwise err
connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

// using express middlewayre to create application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// to let express know where they are located
// the diretory that holds static content
// this is where usually store images, videos
app.use(express.static(path.join(__dirname, 'public')));

//view engine === front-end framework jade
// most commonyly used one is EJS this framework
// lets you create full stack applications quickly
// app.set('view engine', 'jade');

// connecting our routers
// this is our starting point and with each starting point must
// have an "end-point'". 

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler 
// uses http-errors when user goes to url that does not exist in code
// then it will be transferred over to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
