var noble = require('noble'),
    _ = require('lodash');
var sphero = require("sphero");
var fs = require("fs");

var content = fs.readFileSync("sprkp.json");
var jsonContent = JSON.parse(content);
console.log(jsonContent);
for(var i=0; jsonContent.sprkp[i];i++) {
  var t = jsonContent.sprkp[i];
  console.log('add object name: '+t.name+' uuid: '+t.uuid);
  var tsprkp = sphero(t.uuid);
  console.log('connect and send');
  tsprkp.connect(function () {
    console.log('Sleep!!!');
    tsprkp.sleep(0,0,0,function() {
      console.log('Sleep2!!!');
    });
  });
}
