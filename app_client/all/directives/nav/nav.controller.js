(function() {
  function navigaCtrl($location, authentication, $route) {
    var navigavm = this;
    
    navigavm.currLocation = $location.path();
    
    navigavm.logedin = authentication.logedin();
    
    navigavm.currUser = authentication.currUser();

    navigavm.logout = function() {
      authentication.logout();
      $location.path('/');
      $route.reload();
    };
  }
  navigaCtrl.$inject = ['$location', 'authentication', '$route'];

  /* global angular */
  angular
    .module('comments')
    .controller('navigaCtrl', navigaCtrl);
})();