var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Imports instance of sequelize instantiated in models/index.js
var { sequelize } = require('./models');

// Asynchronously connects to database, and tests connection
(async () => {
  await sequelize.sync({force:false});
  try {
    await sequelize.authenticate();
    console.log('Connection to the database established successfully!');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  // next(createError(404, "Sorry, that page doesn't exist! Please check the URL." ));
  const err = new Error();
  err.status = 404;
  err.message = "Sorry, that page doesn't exist! Please check the URL.";
  console.log("Page not found. Please check URL.");
  res.render('page-not-found', {err});

});



// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  err.status = err.status || 500;
      err.message = err.message || 'Sorry, there was a problem with our server.';

  // render the error page
  res.status(err.status);

  if (err.status === 404) {
    // console.log("Page not found. Please check the URL.")
    res.render('page-not-found', { 
      title: "Page Not Found",
      error: err,
     });
  } else {
    // console.log("Server error. Please try again.")
    // err.message = err.message || 'Sorry, there was a problem with our server.';
    res.render('error', { 
      title: "Server Error",
      error: err,
    });
  }
});

module.exports = app;
