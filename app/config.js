'use strict';
var cfg = module.exports = {};
cfg.jwtsecret = 'Addown-secret';

// list of users
cfg.labusers = [
  { login: 'user1',
    password: 'user1pwd'
  },
  { login: 'user2',
    password: 'user2pwd'
  },
  { login: 'user3',
    password: 'user3pwd'
  }
];
cfg.checkuser = function(login, pwd) {
    var u;
    for(var i=0; u=cfg.labusers[i]; i++) {
        if(u.login === login && u.password === pwd) {
            return true;
        }
    }
    return false;
};
module.exports = cfg;
