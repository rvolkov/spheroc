# SpheroC
## Sphero SPRK+ robot controller for MAC OSX and Node.js and web controls

## Version 0.0.1

### Run on MAC OSX
* Install Node.js.
* Clone/Pull this project from github https://github.com/rvolkov/spheroc
* Run `npm install` in project directory
* Run `bower install` in project directory
* Set your web token crypto key into app/config.js
* Set your admin logins/passwords into app/config.js
* Enable Bluetooth on your MAC
* Run `node discover` from the project directory, it will find all your SPRK+ robots and will create file sprkp.json, after some waiting stop it with Ctrl+C
* To reset device to initial state run `node sleep`, do it every time if you can't stop robot or spheroc is unable to detect robot (after robot will shut down exit from utility by Ctrl+C)
* Run `nodemon` to start project locally
* Point browser to `http://127.0.0.1:3001`
* Enter login/password from app/config.js to access
* Shake robot to connect to the Bluetooth
* If you can't connect, exit from web app, run `node sleep`, exit from it, run `nodemon` again
