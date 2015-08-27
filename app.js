var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var https = require('https');
var fs = require('fs');


var log4js = require('log4js');
log4js.configure({
    appenders: [
      { type: 'console' },
      { type: 'file', filename: 'logs/tumfle.log', category: 'cheese' }
    ]
});

log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());
log4js.addAppender(log4js.appenders.file('logs/tumfle.log'), 'cheese');

var logger = log4js.getLogger('cheese');
logger.setLevel('ERROR');

logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var bl = require('./Business/BL');
//app.get('/admin', bl.admin);
app.post("/wines", bl.wines);
app.post("/mydb", bl.test);
app.get("/testpage", function (req, res) {
    console.log(req.body);
    res.sendFile(path.join(__dirname, '/public/combo.html'));
});
app.post('/adminlogin', function (req, res) {
    var bookmarks = [];
    bookmarks.push({ title: "Cozycloud", url: "https://cozycloud.cc" });
    bookmarks.push({ title: "Cozy.io", url: "http://cozy.io" });
    bookmarks.push({ title: "My Cozy", url: "http://localhost:9104/" });
    // We render the templates with the data
    var params = {
        "bookmarks": bookmarks
    };
    res.render('index.jade', params, function (err, html) {
        res.send(html);
    });
});
app.get("/aa", function (req, res) {
    console.log(req.body);
    res.send("True");
});
app.post('/signUpUser', bl.signUpUser);
app.post('/loginUser', bl.loginUser);
app.post('/getLocationList', bl.getLocationList);
app.post('/getOTP', bl.getOTP);
app.post('/confirmOTP', bl.confirmOTP);
app.post('/getSubscriptions', bl.getSubscriptions);
app.post('/getCombos', bl.getSubCombos);
app.post('/getCombodishes', bl.getSubCombosDish);
app.post('/getdailymeal', bl.getdailymeal);
app.post('/addMysubscriptions', bl.addMysubscriptions);
app.post('/checkMobNo', bl.checkMobNo);
app.post('/getUserDetails', bl.getUserDetails);
app.post('/updateMobNo', bl.updateMobNo);
app.post('/updateUserDatails', bl.updateUserDetails);
app.post('/test', bl.getTest);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//setInterval(function () {
//    console.log('test');
//}, 1 * 1 * 1000);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//auth needs to be implemtnted.

module.exports = app;

var key = fs.readFileSync('./ssl/server1.key', 'utf8');
var cert = fs.readFileSync('./ssl/server.crt', 'utf8');
var https_options = {
    key: key,
    cert: cert
};
var PORT = 8000;
var HOST = '127.0.0.1';
//app = express();

https.createServer(https_options, app).listen(PORT, HOST);
console.log('HTTPS Server listening on %s:%s', HOST, PORT);

//app.listen(3000);
//console.log('Listening on port 3000...');