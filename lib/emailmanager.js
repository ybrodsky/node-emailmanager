var request = require('request');
var _ = require('underscore');

/**
* Constructor function
* @domain         String: domain name provided by EmailManager - Ex: "mydomain"
* @username       String: username name provided by EmailManager - Ex: "mail@myemail.com"
* @password       String: password provided by EmailManager - Ex: "mypassword"
*
**/
var EmailManager = function(domain, username, password) {
  if(!domain || !username || !password) throw new Error('Please specify domain, username and password');

  this.domain   = domain;
  this.username = username;
  this.password = password;
  this.url = 'http://api.emailmanager.com/1.0/';
};

/**
* Calls an action from EmailManager's Api
* @method         String: name of the action
* @data           Object: params to be passed to the action
* @callback       Function: callback function
*
*
* If there's no ApiKey setted up it fetches an ApiKey before making the request
* to the desired action
**/
EmailManager.prototype.action = function(method, data, callback) {
  var me = this;
  data = this.getParams(method, data);

  if(this.apikey) {
    data.apikey = this.apikey;
    this.request(data, function(err, result) {
      return callback(null, result);
    });
  }else {
    this.authenticate(function(err, apikey) {
      data.apikey = apikey;
      me.request(data, function(err, result) {
        return callback(null, result);
      });
    });
  }
};

/**
* Merges the passed params with defaults required by EmailManager
* @method         String: name of the action
* @data           Object: params to be passed to the action
*
**/
EmailManager.prototype.getParams = function(method, data) {
  data = data || {};
  data = _.extend(data, {
    method:   method,
    username: this.username,
    password: this.password,
    domain:   this.domain,
    output:   'json'
  });

  return data;
};

/**
* Makes the request
* @data           Object: params to be passed to the action
* @callback       Function: callback function
**/
EmailManager.prototype.request = function(data, callback) {
  var options = {
    method: 'POST',
    keepAlive: false,
    url: this.url,
    form: data,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  var result = request(options, function (error, response, body) {
    return callback(null, JSON.parse(body));
  });
};

/**
* Authenticates to EmailManager in order to get an ApiKey
* @callback       Function: callback function
*
**/
EmailManager.prototype.authenticate = function(callback) {
  var data = this.getParams('authentLogin', null);
  this.request(data, function(err, result) {
    if(err || !result[0].apikey) throw new Error('Failed to get ApiKey');

    this.apikey = result[0].apikey;

    return callback(null, result[0].apikey);
  });
};


module.exports = EmailManager;