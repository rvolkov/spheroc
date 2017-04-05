'use strict';
var controllers;
controllers = angular.module('sphero.controllers', []);
function getapiroot($location) {
  var lhost = $location.host();
  var lport = $location.port();
  return 'http://'+lhost+':'+lport;
}
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
///////// controllers ///////////
controllers.controller('VoidCtrl',['$scope',
    function($scope) {
      // this is only for testing
      $scope.testThings = [
        'TEST1'
      ];
    }
  ]
)
.controller('LoginCtrl', ['$scope','$location','$window','AuthenticationService','$http',
    '$routeParams',function($scope,$location,$window,AuthenticationService,$http,$routeParams) {
        $scope.apiroot = getapiroot($location);
        $scope.user = {username:'',password:'',submit:''};
        $scope.error = '';
        $scope.submit = function () {
        if($scope.user.username !== undefined && $scope.user.password !== undefined) {
            $http.post(getapiroot($location) + '/login', $scope.user)
            .then(function onSuccess(response) {
                var data = response.data;
                var encodedProfile = data.token.split('.')[1];
                var profile = JSON.parse(urlBase64Decode(encodedProfile));
                $scope.profile = profile;
                if(profile.login === $scope.user.username) {
                    AuthenticationService.isLogged = true;
                    AuthenticationService.login = $scope.user.username;
                    AuthenticationService.token = data.token;
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.login = $scope.user.username;
                    $scope.error = '';
                    $location.path('/sphero');
                } else {
                    $scope.error = 'Error: Invalid user received from token';
                    AuthenticationService.isLogged = false;
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.login;
                }
            })
            .catch(function onError(data) {
                AuthenticationService.isLogged = false;
                $scope.error = 'Error: Invalid user or password';
            });
        }
    };
    // this is only for testing
    $scope.testThings = [
      'TE1',
      'TE2',
      'TE3'
    ];
}])
.controller('MainCtrl',['$scope', '$http', '$location', '$window', 'AuthenticationService', '$interpolate', '$sce', '$compile', '$interval', function($scope, $http, $location, $window, AuthenticationService, $interpolate, $sce, $compile, $interval) {
    $scope.user = {username:'username',password:'password',submit:''};
    $scope.apiroot = getapiroot($location);
    $scope.error = '';
    $scope.user.username = AuthenticationService.login;
    // this is only for testing
    $scope.testThings = [
      'TEST1',
      'TEST2',
      'TEST3',
      'TEST4'
    ];
    $scope.logout = function() {
        $scope.error = '';
        AuthenticationService.isLogged = false;
        delete $window.sessionStorage.token;
        $location.path('/');
    };

    var number_of_failed_timeouts = 0;
    var error_detected = false;
    $scope.noserver = false;
    $scope.info = '';
    // request information about Sphero
    $scope.getS = function() {
        $http.get(getapiroot($location) + '/webapi/info')
        .then(function onSuccess(response) {
            var data = response.data;
            $scope.info = JSON.parse(data.message);
            $scope.error = '';
            error_detected = false;
        });
    };
    $scope.getS();
    // request to connect to BT
    $scope.connect = function() {
        $http.post(getapiroot($location) + '/webapi/connect')
        .then(function onSuccess(response) {
            $scope.error = '';
            error_detected = false;
        });
    };
    $scope.color = function(c, uuid) {
        $http.post(getapiroot($location) + '/webapi/color/'+c+'/'+uuid)
        .then(function onSuccess(response) {
            $scope.error = '';
            error_detected = false;
        });
    };
    $scope.sleep = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/sleep/'+uuid)
        .then(function onSuccess(response) {
            $scope.error = '';
            error_detected = false;
        });
    };
    $scope.start_random = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/random/start/'+uuid)
        .then(function onSuccess(response) {
            $scope.error = '';
            error_detected = false;
        });
    };
    $scope.stop_random = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/random/stop/'+uuid)
        .then(function onSuccess(response) {
            $scope.error = '';
            error_detected = false;
        });
    };
    $scope.start_random_move = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/random/move/start/'+uuid)
        .then(function onSuccess(response) {
            $scope.error = '';
            error_detected = false;
        });
    };
    $scope.stop_random_move = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/random/move/stop/'+uuid)
        .then(function onSuccess(response) {
            $scope.error = '';
            error_detected = false;
        });
    };
    $scope.getpower = function(uuid) {
        $http.get(getapiroot($location) + '/webapi/power/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.move = function(l, d, uuid) {
        $http.post(getapiroot($location) + '/webapi/move/'+l+'/'+d+'/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.detect_collisions = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/detect_collisions/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.undetect_collisions = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/undetect_collisions/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.detect_velocity = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/detect_velocity/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.undetect_velocity = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/undetect_velocity/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.detect_odometer = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/detect_odometer/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.undetect_odometer = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/undetect_odometer/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.detect_angles = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/detect_angles/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.undetect_angles = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/undetect_angles/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.detect_accelerometer = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/detect_accelerometer/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.undetect_accelerometer = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/undetect_accelerometer/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.detect_accelone = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/detect_accelone/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    $scope.undetect_accelone = function(uuid) {
        $http.post(getapiroot($location) + '/webapi/undetect_accelone/'+uuid)
        .then(function onSuccess(response) {
          $scope.error = '';
          error_detected = false;
        });
    };
    // every 3 seconds we need to ask server about changes with Sphero status
    var number_of_failed_timeouts = 0;
    var timer = $interval(function(){
        $scope.getS();
        //$scope.getStatuses();
        //scanLEDs();
        if(error_detected) {
          number_of_failed_timeouts = number_of_failed_timeouts + 1;
        } else {
          number_of_failed_timeouts = 0;
        }
        error_detected = true;
        if(number_of_failed_timeouts > 2) { $scope.noserver = true; }
        if(number_of_failed_timeouts == 0) { $scope.noserver = false; }
    },3000);
  }
]);
