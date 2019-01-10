(function() {
  function authentication($window, $http) {
    /*var b64Utf8 = function (seq) {
      return decodeURIComponent(Array.prototype.map.call($window.atob(seq), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    };*/
    
    var storeToken = function(token) {
      $window.localStorage['comments-token'] = token;
    };
    
    var returnToken = function() {
     return $window.localStorage['comments-token'];
    };
    
    var registration = function(user) {
      return $http.post('/api/registration', user).then(
        function success(data) {
          storeToken(data.data.token);
        });
    };

    var login = function(user) {
      return $http.post('/api/login', user).then(
        function success(data) {
          storeToken(data.data.token);
        });
    };

    var logout = function() {
      $window.localStorage.removeItem('comments-token');
    };
    
    var logedin = function() {
        var token = returnToken();
        if (token) {
          var content = JSON.parse($window.atob(token.split('.')[1]));
          return content.validityDate > Date.now() / 1000;
        } else {
          return false;
        }
      };
    var currUser = function() {
        if (logedin()) {
          var token = returnToken();
          var content = JSON.parse($window.atob(token.split('.')[1]));
          return {
            mail: content.mail,
            name: content.name
          };
        }
      };
      
    var getDataFromToken = function(token) {
        return JSON.parse($window.atob(token.split('.')[1]));
      };

    
    return {
      storeToken: storeToken,
      returnToken: returnToken,
      registration: registration,
      login: login,
      logout: logout,
      logedin: logedin,
      currUser: currUser,
      getDataFromToken: getDataFromToken
    };
  }
  authentication.$inject = ['$window', '$http'];
  
  /* global angular */
  angular
    .module('comments')
    .service('authentication', authentication);
})();