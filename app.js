const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/server');
const logger = require('morgan');

require('dotenv').config({ path: '/env/.env' })

logger.format('mydate', function() {
    var df = require('dateformat');
    return df(new Date(), 'HH:MM:ss.l');
});

const app = express();
app.use(logger('\x1b[97m[:mydate]\x1b[0m \x1b[36m:method\x1b[0m \x1b[90m:url\x1b[2m \x1b[32m:status\x1b[2m \x1b[35m:res[content-length]\x1b[0m - \x1b[35m:remote-addr\x1b[0m - \x1b[93m:response-time ms\x1b[0m'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

// const favicon = require('serve-favicon');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//app.use(logger('dev'));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(allowCrossDomain);


// const cors = require('cors');
// app.use(cors({
//     origin: '*'
// }));

// API SETUP
app.db = require('./config/db');

// include the routes
const index = require('./routes/index');
const data = require('./routes/data');

// set routes
//app.use('/logic', express.static(__dirname + '/routes/logic/index.html'));

app.use('/api', index);
//app.use(`${config.apiPath}/projects`, projects);
// app.use(`${config.apiPath}/scenarios`, scenarios);
app.use(`${config.apiPath}/data`, data);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
