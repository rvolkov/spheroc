'use strict';
// work with external RESTbox-controller
var Client = require('node-rest-client').Client;
var sphero = require('./sphero.js');

var rbox = module.exports = {};

var rbox_server = '127.0.0.1:3001';
var rbox_secret = 'cscossp1';

var options = {
        connection: {
            rejectUnauthorized: false,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        },
        requestConfig: {
            timeout: 60000,
            noDelay: true,
            keepAlive: true,
            keepAliveDelay: 1000
        },
        responseConfig: {
            timeout: 300000
        }
};

var client = new Client(options);
var rest_call_get = function(clnt, url, arg, callback) {
  clnt.get(url, arg, callback).on('error', function (err) {
	   console.log('something went wrong on the get request', err.request.options);
  });
};
var rest_call_post = function(clnt, url, arg, callback) {
  clnt.post(url, arg, callback).on('error', function (err) {
	   console.log('something went wrong on the get request', err.request.options);
  });
};

// check RESTbox-controller
rbox.check_rbox = function(s) {
  console.log('call for check_rbox');
  for(var i=0; s[i]; i++) {
    if(s[i].stat == 'connected') {
      console.log('request to RESTbox-controller http://'+rbox_server+'/api/sphero/'+s[i].name+'/'+rbox_secret);
      rest_call_get(client,
        'http://'+rbox_server+'/api/sphero/'+s[i].name+'/'+rbox_secret,{},
          function(d ,r) {
            /*
              console.log("Received data=",d);
              Received data= { message:
   [ { type: 'collision', id: 0, status: 0 },
     { type: 'led', id: 0, status: 0 },
     { type: 'led', id: 1, status: 0 },
     { type: 'led', id: 2, status: 0 },
     { type: 'move', id: 0, status: 0 },
     { type: 'move', id: 1, status: 0 } ] }
            */
              // here we need to parse it and initiate color change or move
              var res = d;
              for(var i = 0; res[i]; i++) {
                if(d.type == 'led') {
                  if(d.id == 0 && d.status == 1) { // green
                    sphero.color('green', s[i].uuid);
                  }
                  if(d.id == 1 && d.status == 1) { // red
                    sphero.color('red', s[i].uuid);
                  }
                  if(d.id == 2 && d.status == 1) { // blue
                    sphero.color('blue', s[i].uuid);
                  }
                }
                if(d.type == 'move') {
                  if(d.id == 0 && d.status == 1) { // forward 10
                    sphero.move(100, 0, s[i].uuid);
                  }
                  if(d.id == 1 && d.status == 1) { // back 10
                    sphero.move(100, 180, s[i].uuid);
                  }
                }
              }
          }
      );
    }
  }
};

rbox.reportCollision = function(name) {
  console.log('request to RESTbox-controller http://'+rbox_server+'/api/sphero/'+name+'/'+rbox_secret+'/collision');
  rest_call_post(client,
    'http://'+rbox_server+'/api/sphero/'+name+'/'+rbox_secret+'/collision',{},
      function(d ,r) {
          console.log("CollsiON received data=",d);
      }
  );
};
rbox.removeCollision = function(name) {
  console.log('request to RESTbox-controller http://'+rbox_server+'/api/sphero/'+name+'/'+rbox_secret+'/collisioff');
  rest_call_post(client,
    'http://'+rbox_server+'/api/sphero/'+name+'/'+rbox_secret+'/collisioff',{},
      function(d ,r) {
          console.log("CollisiOFF received data=",d);
      }
  );
};
module.exports = rbox;
