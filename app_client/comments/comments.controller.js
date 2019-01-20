(function() {
function commentsCtrl(commentsData, $location, $scope, authentication, $filter) {
  var vm = this;
  vm.title = 'Comments';
  vm.msg = "Searching comments...";
  
  vm.logedin = authentication.logedin();
  vm.user = authentication.currUser();
  vm.data = {comments:[]};
  
  commentsData.comments().then(
    function succes(response){
      vm.msg = response.data.length > 0 ? "" : "No comments.";
      vm.data = {'comments': response.data};
    },
    function error(response){
      vm.msg = "Error while fetching comments.";
      console.log(response.e);
      return;
    });
    
    vm.newComment = function(){
      //name: req.body.name,
       //   comment: req.body.comment,
       //   pic: req.body.pic,
       vm.newcomment.pic = '';
       vm.newcomment.name = vm.user.name;
       vm.newcomment.username = vm.user.mail;
       commentsData.newComment(vm.newcomment).then(
          function succes(response){
            vm.msg = response.data.length > 0 ? "" : "No comments.";
            vm.data.comments.push(response.data);
            vm.newcomment.name = '';
            vm.newcomment.comment = '';
            console.log(vm.data);
          },
          function error(response){
            vm.msg = "Error while fetching comments.";
            console.log(response.e);
          });
    };
    
/////////////////PAGINATION////////////////////////
    vm.currentPage = 0;
    vm.pageSize = 10;
    vm.q = '';
    vm.dataSize = 0;
    
    //vm.getData = function() {
    //  return $filter('filter')(vm.data.comments, vm.q)
    //}
    
    vm.getDataLenght = function() {
      return commentsData.getCommentsCount().size;
    }
    
    /* Returns page of comments. */
    vm.getCommentsPage = function(page) {
      vm.currentPage = page;
      vm.dataSize = vm.getDataLenght();

      commentsData.getCommentsPage(vm.currentPage).then(
        function success(res) {
          vm.data.comments = res.data;
        },
        function error(err) {
          var error = err.data ? err.data.message : err;
          vm.msg = `An error occures while getting comments: ${error}.`;
          console.log(error);
        }
      )
    }
  
    vm.numberOfPages = function() {
      return Math.ceil(vm.getDataLenght() / vm.pageSize);
    }
    
    $scope.redirectTo = function(comment){
        //redirectTo
         $location.url('/comments/'+comment._id);
        };
        
    /* Get initial comment */
    vm.getCommentsPage();
}
commentsCtrl.$inject = ['commentsData', '$location', '$scope', 'authentication', '$filter'];

/* global angular */
angular
  .module('comments')
  .controller('commentsCtrl', commentsCtrl);
  
})();