var express = require("express");
var app = express();

var http = require("http").createServer(app);

// filters will be applied to requests on all addresses 
// (even those that are not explicitly specified by means of Express) - 
// thus it could result in hanging response

app.use(function(req, res, next) {
    res.type('text/html');
    console.log('general filter has been applied');
    
    next();
});

// filters could be declared in one statement as a sequence of parameters

app.use(
    function(req, res, next) {
        // multiple res.send() intentionally do not allowed (due to issues with headers) - thus using #write as a workaround
        res.write('<h3>first filter has been reached</h3>'); 
        next();
    },
    function(req, res, next) {
        res.write('<h3>second filter has been reached</h3>');
        next();
    });

app.get('/', function(req, res) {
    res.end('<h1>Index page content has been reached</h1>');
});

app.get('/blocking', function(req, res) {
    res.end('<h1>Page content has been reached</h1>');
});

// next filter is intended to be applied to request for a specific address

// order DOES matter - next filter will not be applied to request for /blocking
// due to the fact that it has been already served in the previous statement

app.get('/blocking', function(req, res, next) {
    res.end('<h3>Content blocker has been reached</h3>');
});

http.listen(process.env.PORT, process.env.IP, function() {
    console.log('server is now listening..');
});