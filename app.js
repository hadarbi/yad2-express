const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const adsRouter = require('./routes/ads');
const usersRouter = require('./routes/users');
const { decrypt } = require('./utils/encryption');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "somesecretkey",
  resave: false, // Force save of session for each request
  saveUninitialized: false, // Save a session that is new, but has not been modified
  cookie: { maxAge: 10 * 60 * 1000 } // milliseconds!
}));


app.use(function (req, res, next) {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const userString = decrypt(authorization);
      const user = JSON.parse(userString);
      req.user = user; // Set the 'user' property on the request
    } catch {
      console.log("Couldn't parse auth token");
    }
  }
  next();
});

app.use('/', indexRouter);
app.use('/ads', adsRouter);
app.use('/users', usersRouter);

const db = require('./models/index');
// create the tables if don't exist
db.sequelize.sync().then(() => {
  console.log('Database Synced');
}).then(async () => {
  await db.User.findOrCreate({
    where: { username: 'admin' },
    defaults: { password: 'admin', isAdmin: true }
  });
  await db.User.findOrCreate({
    where: { username: 'admin2' },
    defaults: { password: 'admin2', isAdmin: true }
  });
}).catch((err) => {
  console.log('Error: ', err);
});


// catch 404 and forward to error handler
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
