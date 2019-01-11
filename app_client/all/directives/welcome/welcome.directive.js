(function() {
  var welcome = function() {
    return {
      restrict: 'EA',
      templateUrl: '/all/directives/welcome/welcome.template.html'
    };
  };
  
  /* global angular */
  angular
    .module('comments')
    .directive('welcome', welcome);
})();