(function() {
/* You can "stay inside" the single page app when using $location in which case 
you can choose between $location.path(YOUR_URL); or $location.url(YOUR_URL);. 
So the basic difference between the 
2 methods is that $location.url() also affects get parameters 
whilst $location.path() does not. - source: https://stackoverflow.com/questions/27941876/how-to-redirect-to-another-page-using-angularjs  */  

function otherCtrl($location){
        $location.path('/');
    }
    
otherCtrl.$inject = ['$location'];

/* global angular */
angular
  .module('comments')
  .controller('otherCtrl', otherCtrl);
})();