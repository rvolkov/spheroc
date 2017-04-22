'use strict';
// work with external RESTbox-controller
var Client = require('node-rest-client').Client;
var sphero = require('./sphero.js');

var rbox = module.exports = {};
var rbox_server = 'server.com';
var rbox_secret = 'cisco';

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
function check_rbox() {
  var s = sphero.getS();
  for(var i=0; s[i]; i++) {
    if(s[i].stat == 'connected') {
      rest_call_get(Client,
        'http://'+rbox_server+'/api/sphero/'+s[i].name+'/'+rbox_secret+'/',{},
          function(d ,r) {
              console.log("Received data=",d);
              // here we need to parse it and initiate color change or move
          }
      );
    }
  }
}
rbox.runChecks = function() {
  setInterval(check_rbox, 2000); //call every 2 seconds
};

rbox.reportCollision = function(name) {
  rest_call_post(Client,
    'http://'+rbox_server+'/api/sphero/'+name+'/'+rbox_secret+'/collision',{},
      function(d ,r) {
          console.log("Received data=",d);
      }
  );
};
rbox.removeCollision = function(name) {
  rest_call_post(Client,
    'http://'+rbox_server+'/api/sphero/'+name+'/'+rbox_secret+'/collisioff',{},
      function(d ,r) {
          console.log("Received data=",d);
      }
  );
};
