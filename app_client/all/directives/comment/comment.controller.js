(function() {
  function commentDirCtrl($scope, authentication, commentsData, $location, $route) {
    var commdirvm = this;
    commdirvm.logedin = authentication.logedin();
    commdirvm.landing = $location.path() != '/';
    
    commdirvm.user = authentication.currUser();
    if(commdirvm.user) {
      commdirvm.user.username = commdirvm.user.mail;
    }
    
    commdirvm.deleteById = function(id){
      commentsData.deleteById(id, commdirvm.user).then(
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