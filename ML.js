var fs = require('fs');
var express = require('express');
var https = require('https');
var key = fs.readFileSync('./ssl/server1.key', 'utf8');
var cert = fs.readFileSync('./ssl/server.crt', 'utf8');
var https_options = {
    key: key,
    cert: cert
};
var PORT = 8000;
var HOST = '127.0.0.1';
app = express();

https.createServer(https_options, app).listen(PORT, HOST);
console.log('HTTPS Server listening on %s:%s', HOST, PORT);


// routes
app.get('/hey', function (req, res) {
    console.log('test');
    res.send('HEY!');
});
app.post('/ho', function (req, res) {
    res.send('HO!');
});