(function() {
  function commentEdit($uibModalInstance, commentDetails, commentsData) {
    var vm = this;
    
    vm.commentDetails = commentDetails;

    vm.modalWindow = {
      onclose: function() {
        $uibModalInstance.close();
      },
      onsubmit: function(response) {
        $uibModalInstance.close(response);
      }
    };
    
    vm.sendData = function() {
      vm.error = "";
          if (!vm.editData.commentContent) {
            vm.error = "Input required!";
            return false;
          } else {
            vm.editComment(commentDetails.comment._id, vm.editData.commentContent);
            
            return false;
          }
    };
    
    //just the comment content is to be sent
    vm.editComment = function(id, comment) {
      commentsData.editCommentById(id, {
        comment: comment
      }).then(
        function success(response) {
          vm.modalWindow.onsubmit(response.data);
          
        },
        function error(response) {
          vm.error = "Error!";
        }
      );
    };
  }
  commentEdit.$inject = ['$uibModalInstance', 'commentDetails', 'commentsData'];

  /* global angular */
  angular
    .module('comments')
    .controller('commentEdit', commentEdit);
})();