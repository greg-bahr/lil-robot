var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var makePwm = require('adafruit-pca9685');
var pwm = makePwm({ freq: 50, correctionFactor: 1.118 });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = http.createServer(app)
app.server = server

var io = require('socket.io')(server);

var clients = [];
var currrDriver = "";
var driveTime = 15; // in seconds

io.on('connection', (socket) => {
    console.log('Client Connected.');
    clients.push(socket.id);

    if(clients.length == 1) {
	currDriver = clients[0];
	console.log('Setting current driver to socket: ' + currDriver);
    }

    socket.on('drive', (data) => {
	if (socket.id == currDriver) {
	switch(data.direction) {
            case 'forward':
                pwm.setPulse(0, 2000);
                pwm.setPulse(1, 1000);
                break;
            case 'backward':
                pwm.setPulse(0, 1000);
                pwm.setPulse(1, 2000);
                break;
            case 'left':
                pwm.setPulse(0, 1000);
                pwm.setPulse(1, 1000);
                break;
            case 'right':
                pwm.setPulse(0, 2000);
                pwm.setPulse(1, 2000);
                break;
            default:
                pwm.setPulse(0, 0);
                pwm.setPulse(1, 0);
        }
	}    
    });
    socket.on('disconnect', () => {
	clients.splice(clients.indexOf(socket));
	console.log('Client Disconnected');
	if(clients.length == 1) { 
            currDriver = clients[0];
	}
    });
});

function nextDriver() {
  if(clients.length > 1) {
    currDriver = clients.shift();
    clients.push(currDriver);
    console.log('Changing current driver to socket: ' + currDriver);
    console.log(clients);
  }
  setTimeout(nextDriver, driveTime * 1000);
}

nextDriver();

module.exports = app;
