'use strict';
var noble = require('noble'),
    _ = require('lodash');
var sphero = require("sphero");
var fs = require("fs");

var SCANTIME = 20;

var Spheros = [];

function addSphero(name, uuid) {
  var t = {
    name: name,
    uuid: uuid
  };
  Spheros.push(t);
};

function createconf() {
  var data = '{ "sprkp": [\n';
  for(var i=0; Spheros[i]; i++) {
    data = data + '{';
    data = data + '"name":"'+Spheros[i].name+'",';
    data = data + '"uuid":"'+Spheros[i].uuid+'"';
    data = data + '}';
    if(Spheros[i+1]) {
      data = data + ',\n';
    }
  }
  data = data + ']}';
  console.log('Create SPRK+ config file ./sprkp.json');
  try {
    fs.unlinkSync('sprkp.json');
  }
  catch(e){}
  fs.appendFile('sprkp.json', data, function(err) {
    if(err) {
        console.log('there was an error: ', err);
        return;
    }
    console.log('data was saved to file');
    process.exit(1);
  });
}

function stopscan() {
  noble.stopScanning(function() {
      console.log('scan stopped.');
      createconf();
  });
}

function discover() {
  console.log('Beginning Discover (during '+SCANTIME+' seconds), try to shake your SPRK+');
  noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
      console.log('powered on');
      setTimeout(stopscan, SCANTIME * 1000);
      noble.startScanning();
    } else {
      console.log('is is not powered on');
      noble.stopScanning();
    }
  });
  noble.on('discover', function(peripheral){
    if(_.includes(peripheral.advertisement.localName, 'SK-')) {
      //console.log(peripheral);
      var deviceUUID = peripheral.uuid,
      localName = peripheral.advertisement.localName;
      console.log('SPRK+ UUID - "' + deviceUUID + '" Local Name: '+localName);
      var SPRKP_UUID = deviceUUID;
      var SPRKP_localName = localName;
      addSphero(SPRKP_localName, SPRKP_UUID);
    } else {
      console.log('Not our droid - Name: ' + peripheral.advertisement.localName);
    }
  });
};

try {
  discover();
} catch (e) {
    console.error(e);
}
