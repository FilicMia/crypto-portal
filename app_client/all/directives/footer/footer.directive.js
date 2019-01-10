(function() {
  var footos = function() {
    return {
      restrict: 'EA',
      templateUrl: '/all/directives/footer/footer.template.html'
    };
  };
  
  /* global angular */
  angular
    .module('comments')
    .directive('footos', footos);
})();