# SpheroC
## Sphero SPRK+/BB8 robot controller with web controls (Node.js/Express.js)

## Version 0.0.1

### Old Sphero/SPRK doesn't supported, only BLE models
### If you have Ollie, try to add name into selection into discover.js file, it should work as well
### it should support any number of robots (I saw somewhere that MAC supports up to 6), but I tested it only on 1 SPRK+ robot
### I developed it on MAC OSX, but should work on any platform with Node.js and BLE (Bluetooth Low Energy)


### Run on MAC OSX
* Install Node.js.
* Clone/Pull this project from github https://github.com/rvolkov/spheroc
* Run `npm install` in project directory
* Run `bower install` in project directory
* Set your web token crypto key into app/config.js (any string you only know)
* Set your admin logins/passwords into app/config.js
* Enable Bluetooth on your MAC
* Run `node discover` from the project directory, shake your robot to enable BLE, it will find all your SPRK+/BB8 robots and will create file sprkp.json, it is sniffing for a BLE devices for 20 seconds after that writes down all the detected SPRK+/BB8 devices into sprkp.json file and exits
* To reset device to initial state run `node sleep`, do it every time if you can't stop robot or spheroc is unable to detect robot (after robot will shut down exit from utility by Ctrl+C) - it will possibly reset all the detected robots, but I didn't check more than 1
* Run `nodemon` to start project locally
* Point browser to `http://127.0.0.1:3001`
* Enter login/password from app/config.js to access
* Shake robot to connect to the Bluetooth
* If you can't connect, exit from web app, run `node sleep`, exit from it, run `nodemon` again

### Enjoy!
