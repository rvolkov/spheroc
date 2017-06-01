'use strict';
// work with external RESTbox-controller
var Client = require('node-rest-client').Client;
var rbox = module.exports = {};
//var sph = require('./sphero.js');

//var rbox_server = 'ltrcrt2225.herokuapp.com';
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
function rest_call_get(clnt, url, arg, callback) {
  clnt.get(url, arg, callback).on('error', function (err) {
	   console.log('something went wrong on the get request', err.request.options);
  });
}
function rest_call_post(clnt, url, arg, callback) {
  clnt.post(url, arg, callback).on('error', function (err) {
	   console.log('something went wrong on the get request', err.request.options);
  });
}

function apply(s,res,uuid) {
  var m;
  for(var j = 0; m=res[j]; j++) {
      console.log("!!!!! m.type="+m.type+" m.id="+m.id+" m.status="+m.status);
      if(m.type == 'led') {
        if(m.id == 0 && m.status == 1) { // green
            s.color('green');
        }
        if(m.id == 1 && m.status == 1) { // red
            s.color('red');
        }
        if(m.id == 2 && m.status == 1) { // blue
            s.color('blue');
        }
        if(m.id == 3 && m.status == 1) { // white
            s.color('white');
        }
      }
      if(m.type == 'move') {
        if(m.id == 0 && m.status == 1) { // forward 10
            s.roll(80, 0);
        }
        if(m.id == 1 && m.status == 1) { // back 10
            s.roll(80, 180);
        }
      }
  }
}

// check RESTbox-controller
rbox.check_rbox = function(s) {
  console.log('call for check_rbox');
  for(var i=0; s[i]; i++) {
    if(s[i].stat == 'connected') {
      var uuid = s[i].uuid;
      var sp = s[i].sphero;
      //sph.setcolor('red', uuid);
      //sph.getSpheros();
      console.log('request to RESTbox-controller http://'+rbox_server+'/api/sphero/'+s[i].name+'/'+rbox_secret);
      rest_call_get(client,
        'http://'+rbox_server+'/api/sphero/check/'+s[i].name+'/'+rbox_secret,{},
          function(d ,r) {
              console.log("Received data=",d);

            /*
              Received data= { message:
   [ { type: 'collision', id: 0, status: 0 },
     { type: 'led', id: 0, status: 0 },
     { type: 'led', id: 1, status: 0 },
     { type: 'led', id: 2, status: 0 },
     { type: 'move', id: 0, status: 0 },
     { type: 'move', id: 1, status: 0 } ] }
            */
              // here we need to parse it and initiate color change or move
              //var res = d.message;
              apply(sp,d.message, uuid);
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
