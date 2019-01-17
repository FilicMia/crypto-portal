(function() {
    function startFrom(){
      return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
      }
    };
    
    /* global angular */
    angular
        .module('comments')
        .filter('startFrom', startFrom);
})();
