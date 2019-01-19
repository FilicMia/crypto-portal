(function() {
function commentsCtrl(commentsData, $location, $scope, authentication, $filter) {
  var vm = this;
  vm.title = 'Comments';
  vm.msg = "Searching comments...";
  
  vm.logedin = authentication.logedin();
  vm.user = authentication.currUser();
  
  commentsData.comments().then(
    function succes(response){
      vm.msg = response.data.length > 0 ? "" : "No comments.";
      vm.data = {'comments': response.data};
    },
    function error(response){
      vm.msg = "Error while fetching comments.";
      console.log(response.e);
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
    
    $scope.redirectTo = function(comment){
        //redirectTo
         $location.url('/comments/'+comment._id);
        };
        
        /////////////////PAGINATION////////////////////////
    vm.currentPage = 0;
    vm.pageSize = 10;
    vm.q = '';
    vm.dataSize = 0;
    vm.data = {};
    vm.data.comments = [];
    vm.data.count = {};
    commentsData.getCommentsCount().then(function succes(response){
            vm.data.count = response.data;
          },
          function error(response){
            vm.msg = "Error while fetching comments count.";
            console.log(response.e);
          }); 
    
    vm.getData = function() {
      return $filter('filter')(vm.data.comments, vm.q)
    }
    
    vm.getDataLenght = function() {
      return vm.data.count.size;
    }
  
    vm.numberOfPages = function() {
      return vm.data.count.pages;
    }
    
    $scope.redirectTo = function(comment){
        //redirectTo
         $location.url('/comments/'+comment._id);
        };
        
}
commentsCtrl.$inject = ['commentsData', '$location', '$scope', 'authentication', '$filter'];

/* global angular */
angular
  .module('comments')
  .controller('commentsCtrl', commentsCtrl);
  
})();