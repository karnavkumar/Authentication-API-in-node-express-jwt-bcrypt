// call required modules 
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);

//mongodb url
var url = "mongodb://localhost/authentication";
// mongodb connection with help of mongoose framework
mongoose.connect(url, function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('connected to the database ' +url);
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// a logger who logged all incoming and outgoing data
app.use(morgan('dev'));
// says that all the data in the public directoty
app.use(express.static(__dirname + '/public'));
var router = express.Router();
// define api
router = require('./api//api')(app,express);
app.use('/api', router);
// call bower componenets by just adding /bower_components in index.html
app.use('/bower_components', express.static(__dirname +'/bower_components'));

// request a main index.html page 
app.get('*', function (req, res) {
   res.sendFile(__dirname + '/public/index.html');
});

// call http server 
var server = http.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("i am listening at localhost:%s:%s", host, port);

});
