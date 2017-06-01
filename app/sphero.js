var noble = require('noble'),
    _ = require('lodash');
var sphero = require("sphero");
//var cfg = require('./config.js');
var fs = require("fs");
var rbox = require('./rbox.js');
var sph = module.exports = {};
var Spheros = [];

sph.addSphero = function(name, uuid, s, statu) {
  var t = {
    name: name,
    uuid: uuid,
    sphero: s,
    stat: statu,
    randomColor_interval_id: '',
    randomMove_interval_id: '',
    power: '',
    collision: 'no',
    colldetect: 'no',
    color: '',
    velocity: '',
    velocitydetect: 'no',
    odometer: '',
    odometerdetect: 'no',
    angles: '',
    anglesdetect: 'no',
    accelerometer: '',
    accelerometerdetect: 'no',
    accelone: '',
    accelonedetect: 'no'
  };
  Spheros.push(t);
};

sph.getSpheros = function() {
  return Spheros;
};

sph.getS = function() {
  var out = [];
  for(var i=0; Spheros[i]; i++) {
    var t = Spheros[i];
    var o = {
      name: t.name,
      uuid: t.uuid,
      stat: t.stat,
      power: t.power,
      collision: t.collision,
      colldetect: t.colldetect,
      color: t.color,
      velocity: t.velocity,
      odometer: t.odometer,
      angles: t.angles,
      accelerometer: t.accelerometer,
      accelone: t.accelone
    };
    out.push(o)
  }
  return out;
};

sph.get_uuid = function(name) {
  for(var i=0; Spheros[i]; i++) {
    if(Spheros[i].name == name) {
      return Spheros[i].uuid;
    }
  }
  return 0;
};

sph.initSphero = function() {
  var content = fs.readFileSync("sprkp.json");
  var jsonContent = JSON.parse(content);
  console.log(jsonContent);
  for(var i=0; jsonContent.sprkp[i];i++) {
    var t = jsonContent.sprkp[i];
    console.log('add object name: '+t.name+' uuid: '+t.uuid);
    sph.addSphero(t.name, t.uuid, undefined, 'detected');
  }
};
sph.connect = function() {
  console.log('point1');
  for(var i = 0; Spheros[i]; i++) {
    console.log('point2');
    if(typeof(Spheros[i].uuid) !== 'undefined' && Spheros[i].stat === 'detected' && typeof(Spheros[i].name) !== 'undefined') {
      console.log('point3');
      Spheros[i].sphero = sphero(Spheros[i].uuid);
      console.log('SPRK+ '+Spheros[i].name+' ready to connect');
      Spheros[i].sphero.connect(function() {});
      Spheros[i].stat = 'connected';
    }
  }
};
sph.start_randomColor = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].randomColor_interval_id == '') {
      Spheros[i].sphero.randomColor();
      Spheros[i].randomColor_interval_id = setInterval(function () {
          Spheros[i].sphero.randomColor();
      }, 1000);
      return;
    }
  }
};

sph.stop_randomColor = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid) {
      clearInterval(Spheros[i].randomColor_interval_id);
      Spheros[i].randomColor_interval_id = '';
      return;
    }
  }
};

sph.start_randomMove = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].randomMove_interval_id == '') {
      Spheros[i].randomMove_interval_id = setInterval(function () {
        var direction = Math.floor(Math.random() * 360);
        Spheros[i].sphero.roll(150, direction);
      }, 1000);
      return;
    }
  }
};

sph.stop_randomMove = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid) {
      clearInterval(Spheros[i].randomMove_interval_id);
      Spheros[i].randomMove_interval_id = '';
      return;
    }
  }
};

sph.setcolor = function (c, uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid) {
      Spheros[i].color = c;
      Spheros[i].sphero.color(c, function(err, data) {
        console.log(err || "Color Changed!");
      });
      return;
    }
  }
};

sph.sleep = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid) {
      Spheros[i].sphero.sleep(0,0,0,function() {
        console.log('Sleep!!!');
        Spheros[i].stat = 'sleeping';
      });
      return;
    }
  }
};

sph.getpower = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid) {
      Spheros[i].sphero.getPowerState(function(err, data) {
        if (err) {
          console.log("error: ", err);
          //callback(err);
        } else {
          //Possible power states:
          //0x01 - Battery Charging
          //0x02 - Battery OK
          //0x03 - Battery Low
          //0x04 - Battery Critical
          //console.log("RecVer:         ", data.recVer); //Useful when doing other good stuff
          console.log("  recVer:", data.recVer);
          console.log("  batteryState:      ", data.batteryState);
          console.log("  batteryVolatage: ", data.batteryVoltage);
          console.log("  chargeCount:     ", data.chargeCount);
          console.log("  timeSinceCharge:", Math.floor(data.secondsSinceCharge / 60) +" minutes");
          var out = {
            recVer: data.recVer,
            batteryState: data.batteryState,
            batteryVoltage: data.batteryVoltage,
            chargeCount: data.chargeCount,
            timeSinceCharge: Math.floor(data.secondsSinceCharge / 60)
          };
          Spheros[i].power = out;
        }
      });
      return;
    }
  }
};

sph.move = function (l, d, uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid) {
      Spheros[i].sphero.roll(l, d);
      return;
    }
  }
};

sph.detect_collisions = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].colldetect == 'no') {
      console.log("configure collision");
      Spheros[i].colldetect == 'yes';
      Spheros[i].sphero.detectCollisions();
      Spheros[i].sphero.configureCollisions({
        meth: 0x01,
        xt: 0x10,
        yt: 0x10,
        xs: 0x10,
        ys: 0x10,
        dead: 0x20
      });
      Spheros[i].sphero.on("collision", function(data) {
        //Spheros[i].sphero.stop();
        console.log("collision detected");
        console.log("  data:", data);
        Spheros[i].collision = 'detected';
        rbox.reportCollision(Spheros[i].name);
        setTimeout(function() {
          Spheros[i].collision = 'no';
          rbox.removeCollision(Spheros[i].name);
        }, 10000);
      });
      return;
    }
  }
};

sph.undetect_collisions = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].colldetect == 'yes') {
      Spheros[i].colldetect = 'no';
      rbox.removeCollision(Spheros[i].name);
      console.log("remove collision");
      Spheros[i].sphero.removeListener("collision");
      return;
    }
  }
};

sph.detect_velocity = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].velocitydetect == 'no') {
      console.log("configure velocity detect");
      Spheros[i].velocitydetect == 'yes';
      Spheros[i].sphero.streamVelocity(1, false);
      Spheros[i].sphero.on("velocity", function(data) {
        console.log("::STREAMING VELOCITY::");
        console.log("  data:", data);
        Spheros[i].velocity = data;
      });
      return;
    }
  }
};
sph.undetect_velocity = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].velocitydetect == 'yes') {
      Spheros[i].velocitydetect = 'no';
      console.log("remove velocity detect");
      Spheros[i].sphero.streamVelocity(1, true);
      Spheros[i].sphero.removeListener("velocity");
      return;
    }
  }
};

sph.detect_odometer = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].odometerdetect == 'no') {
      console.log("configure odometer detect");
      Spheros[i].odometerdetect == 'yes';
      Spheros[i].sphero.streamOdometer(1,false);
      Spheros[i].sphero.on("odometer", function(data) {
        console.log("::STREAMING Odometer::");
        console.log("  data:", data);
        Spheros[i].odometer = data;
      });
      return;
    }
  }
};
sph.undetect_odometer = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].odometerdetect == 'yes') {
      Spheros[i].odometerdetect = 'no';
      console.log("remove odometer detect");
      Spheros[i].sphero.streamOdometer(1,true);
      Spheros[i].sphero.removeListener("odometer");
      return;
    }
  }
};
sph.detect_angles = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].anglesdetect == 'no') {
      console.log("configure angles detect");
      Spheros[i].anglesdetect == 'yes';
      Spheros[i].sphero.streamImuAngles(1, false);
      Spheros[i].sphero.on("imuAngles", function(data) {
        console.log("::STREAMING Angles::");
        console.log("  data:", data);
        Spheros[i].angles = data;
      });
      return;
    }
  }
};
sph.undetect_angles = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].anglesdetect == 'yes') {
      Spheros[i].anglesdetect = 'no';
      console.log("remove angles detect");
      Spheros[i].sphero.streamImuAngles(1, true);
      Spheros[i].sphero.removeListener("imuAngles");
      return;
    }
  }
};
sph.detect_accelerometer = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].accelerometerdetect == 'no') {
      console.log("configure accelerometer detect");
      Spheros[i].accelerometerdetect == 'yes';
      Spheros[i].sphero.streamAccelerometer(1, false);
      Spheros[i].sphero.on("accelerometer", function(data) {
        console.log("::STREAMING accelerometer::");
        console.log("  data:", data);
        Spheros[i].accelerometer = data;
      });
      return;
    }
  }
};
sph.undetect_accelerometer = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].accelerometerdetect == 'yes') {
      Spheros[i].accelerometerdetect = 'no';
      console.log("remove accelerometer detect");
      Spheros[i].sphero.streamAccelerometer(1, true);
      Spheros[i].sphero.removeListener("accelerometer");
      return;
    }
  }
};
sph.detect_accelone = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].accelonedetect == 'no') {
      console.log("configure accelone detect");
      Spheros[i].accelonedetect == 'yes';
      Spheros[i].sphero.streamAccelOne(1, false);
      Spheros[i].sphero.on("accelOne", function(data) {
        console.log("::STREAMING accelOne::");
        console.log("  data:", data);
        Spheros[i].accelone = data;
      });
      return;
    }
  }
};
sph.undetect_accelone = function (uuid) {
  for(var i = 0; Spheros[i]; i++) {
    if(Spheros[i].uuid == uuid && Spheros[i].accelonedetect == 'yes') {
      Spheros[i].accelonedetect = 'no';
      console.log("remove accelone detect");
      Spheros[i].sphero.streamAccelOne(1, true);
      Spheros[i].sphero.removeListener("accelOne");
      return;
    }
  }
};
module.exports = sph;
