(function() {
  function commentsViewCtrl($routeParams, commentsData, $uibModal, authentication) {
    var vm = this;
    

    vm.idComment = $routeParams.idComment;
    vm.logedin = authentication.logedin();
    
    commentsData.commentById(vm.idComment)
    .then(function success(response) {
        vm.comment = response.data;
        vm.general = {
          title: vm.comment.name
        };
      },
      function error(odgovor) {
        console.log(odgovor.e);
      });
      
      vm.editComm = function(id, commentData){
        
         var editModalWindow = $uibModal.open({
          templateUrl: '/comments/commentEdit/commentEdit.view.html',
          controller: 'commentEdit',
          controllerAs: 'vm',
          resolve: {
            commentDetails: function() {
              return {
                comment: commentData
              };
            }
          }
        });
        
        // do not call the server for data, but update the comment list
        // do not reftesh the site
        editModalWindow.result.then(function(data) {
    if (typeof data != 'undefined')
      vm.comment = data;
      
      }, function(error) {
        console.log("Error im comment View", error);
      });
        
      };
  }
  commentsViewCtrl.$inject = ["$routeParams", "commentsData", "$uibModal", "authentication"];
  
  /* global angular */
  angular
    .module('comments')
    .controller('commentsViewCtrl', commentsViewCtrl);
})();