(function() {
  function commentDirCtrl($scope, authentication, commentsData, $location, $route) {
    var commdirvm = this;
    commdirvm.logedin = authentication.logedin();
    commdirvm.landing = $location.path() != '/';
    
    commdirvm.deleteById = function(id){
      commentsData.deleteById(id).then(
        function success(response) {
          $location.path('/');
        },
        function error(response) {
          commdirvm.error = "Error!";
        }
      );
    };
  }
  
  commentDirCtrl.$inject = ['$scope','authentication', 'commentsData', 
                    '$location', '$route'];

  /* global angular */
  angular
    .module('comments')
    .controller('commentDirCtrl', commentDirCtrl);
})();