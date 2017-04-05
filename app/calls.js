'use strict';
var sphero = require('./sphero.js');
var jwt = require('jsonwebtoken');
var cfg = require('./config.js');

function urlBase64Decode(str) {
  var output = str.replace('-', '+').replace('_', '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }
  return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}
exports.apicalls = function(app) {
    // ======== external authenticated calls ==========
    // - authentication
    app.post('/login', function(req, res) {
        //console.log('* call for /auth');
        var login = req.body.username;
        var password = req.body.password;
        //console.log('* login='+login+' password='+password);
        if(cfg.checkuser(login,password)) {
            var profile = {
                login: login
            };
            var token = jwt.sign(profile, cfg.jwtsecret, { expiresIn: 60*5*60 });
            res.status(200).json({ message: "OK", token: token });
        } else {
            res.status(401).json({message: "AUTH_ERROR"});
            return;
        }
    });
    // ==== Web portal calls ====
    // - info about Sphero
    app.get('/webapi/info', function(req, res) {
        console.log('* call for /webapi/info');
        var outitem = JSON.stringify(sphero.getS());
        //console.log(outitem);
        res.status(200).json({message: outitem});
    });
    app.post('/webapi/color/:c/:uuid', function(req, res) {
        var c = req.params.c;
        var uuid = req.params.uuid;
        console.log('* call for /webapi/color/'+c+'/'+uuid);
        sphero.color(c,uuid);
        res.status(200).json({message: 'OK'});
    });
    // set sleep
    app.post('/webapi/sleep/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/sleep/'+uuid);
        sphero.sleep(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/random/start/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/random/start/'+uuid);
        sphero.start_randomColor(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/random/stop/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/random/stop/'+uuid);
        sphero.stop_randomColor(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/random/move/start/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/random/move/start/'+uuid);
        sphero.start_randomMove(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/random/move/stop/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/random/move/stop/'+uuid);
        sphero.stop_randomMove(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.get('/webapi/power/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/power/'+uuid);
        sphero.getpower(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/move/:l/:d/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        var l = req.params.l;
        var d = req.params.d;
        console.log('* call for /webapi/move/'+l+'/'+d+'/'+uuid);
        sphero.move(l, d, uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/detect_collisions/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/detect_collisions/'+uuid);
        sphero.detect_collisions(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/undetect_collisions/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/undetect_collisions/'+uuid);
        sphero.undetect_collisions(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/detect_velocity/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/detect_velocity/'+uuid);
        sphero.detect_velocity(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/undetect_velocity/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/undetect_velocity/'+uuid);
        sphero.undetect_velocity(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/detect_odometer/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/detect_odometer/'+uuid);
        sphero.detect_odometer(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/undetect_odometer/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/undetect_odometer/'+uuid);
        sphero.undetect_odometer(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/detect_angles/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/detect_angles/'+uuid);
        sphero.detect_angles(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/undetect_angles/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/undetect_angles/'+uuid);
        sphero.undetect_angles(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/detect_accelerometer/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/detect_accelerometer/'+uuid);
        sphero.detect_accelerometer(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/undetect_accelerometer/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/undetect_accelerometer/'+uuid);
        sphero.undetect_accelerometer(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/detect_accelone/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/detect_accelone/'+uuid);
        sphero.detect_accelone(uuid);
        res.status(200).json({message: 'OK'});
    });
    app.post('/webapi/undetect_accelone/:uuid', function(req, res) {
        var uuid = req.params.uuid;
        console.log('* call for /webapi/undetect_accelone/'+uuid);
        sphero.undetect_accelone(uuid);
        res.status(200).json({message: 'OK'});
    });
};
