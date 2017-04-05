var express = require('express');
//var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var cfg = require('./config.js');
var fs = require('fs');
var app = express();
app.use('/',express.static(__dirname + '/../public/'));
app.use('/scripts',express.static(__dirname + '/../public/scripts'));
app.use('/images',express.static(__dirname + '/../public/images'));
app.use('/views',express.static(__dirname + '/../public/views'));
app.use('/bower_components',express.static(__dirname + '/../public/bower_components'));
//app.use(cors());
app.use(bodyParser.json());
app.use('/webapi', expressJwt({secret: cfg.jwtsecret}));
app.use('/v1', expressJwt({secret: cfg.jwtsecret}));
var sphero = require('./sphero.js');

var calls = require('./calls.js');

sphero.initSphero();
sphero.connect();

function ping_sphero() {
  var t = sphero.getSpheros();
  for(var i = 0; t[i]; i++) {
    var sp = t[i];
    if(typeof(sp.uuid) !== 'undefined' && typeof(sp.sphero) != 'undefined' && sp.stat == 'connected') {
      console.log('ping '+sp.name);
      sp.sphero.ping();
    } else {
      console.log('noping '+sp.name);
    }
  }
};
setInterval(ping_sphero, 5000); //call every 5 seconds

calls.apicalls(app);
app.all('*',
  function(req, res, next) {
    sphero.connect();
    // send the index.html to support HTML5Mode
    fs.readFile(__dirname + '/../public/index.html', 'utf8',
      function(err, content) {
        res.send(content);
      }
    );
  }
);
app.use(
  function(req, res, next) {
    // catch 404 and forwarding to error handler
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
);
/// error handlers
app.use(
    function(err, req, res, next) {
        res.status(200).json({message: err.message, error: err})
    }
);
app.use(
  function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('Internal error('+res.statusCode+'): '+err.message);
    res.send({ error: err.message });
    return;
  }
);
app.get('/ErrorExample',
  function(req, res, next) {
    next(new Error('Random error!'));
  }
);
module.exports = app;
