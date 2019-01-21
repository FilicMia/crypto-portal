(function() {
function commentsCtrl(commentsData, $location, $scope, authentication, $filter) {
  var vm = this;
  vm.title = 'Comments';
  vm.msg = "Searching comments...";
  
  vm.logedin = authentication.logedin();
  vm.user = authentication.currUser();
  
          /////////////////PAGINATION////////////////////////
    vm.currentPage = 0;
    vm.pageSize = 10;
    vm.q = '';
    vm.dataSize = 0;
    vm.data = {};
    vm.data.comments = [];
    vm.data.count = {};
    vm.data.cached = [];
     //////////////////////////////////////////
     
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
            if(vm.currentPage == 0){
              vm.data.comments.unshift(response.data);
              vm.data.cached.slice(-1)[0].unshift(vm.data.comments.slice(-1));
            }
            vm.data.cached
            vm.newcomment.name = '';
            vm.newcomment.comment = '';
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
    
    commentsData.getCommentsCount().then(
      function succes(response){
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
    
    vm.next = function() {
      vm.currentPage = vm.currentPage + 1;
      vm.data.comments = vm.data.cached.slice(-1)[0];
  
      if(vm.currentPage + 1 < vm.numberOfPages()){
        commentsData.getCommentsPage({
          page: vm.currentPage - 1,
          pagesNo: 3,
          pageSize: vm.pageSize
        }).then(
            function succes(response){
              vm.data.cached = response.data;//each page is separately send
              console.log(vm.getDataLenght()/vm.pageSize - 1);
            },
            function error(response){
              //vm.msg = "Error while fetching comments.";
              console.log(response.e);
        });
        
      } else {
            vm.data.cached = vm.data.cached.slice(1,3);
      }
    };
    
    vm.previous = function() {
      vm.currentPage = vm.currentPage - 1;
      vm.data.comments = vm.data.comments = vm.data.cached[0];
      if(vm.currentPage - 1 > 1){
        commentsData.getCommentsPage({
          page: vm.currentPage - 1,
          pagesNo: 3,
          pageSize: vm.pageSize
        }).then(
            function succes(response){
              vm.data.cached = response.data;
              
            },
            function error(response){
              vm.msg = "Error while fetching comments.";
              console.log(response.e);
            });
      } else {
        vm.data.cached = vm.data.cached.slice(0,2);
      }
    };
    
    $scope.redirectTo = function(comment){
        //redirectTo
         $location.url('/comments/'+comment._id);
        };
    
    if(!vm.data.comments.length){
      commentsData.getCommentsPage({
        page: vm.currentPage,
        pageSize: vm.pageSize,
        pageNo: 3
      }).then(
          function succes(response){
            vm.msg = response.data.length > 0 ? "" : "No comments.";
            vm.data.cached = response.data.slice(0,2);
            vm.data.comments = response.data[0];
          },
          function error(response){
            vm.msg = "Error while fetching comments.";
            console.log(response.e);
      });
    }
        
};

commentsCtrl.$inject = ['commentsData', '$location', '$scope', 'authentication', '$filter'];

/* global angular */
angular
  .module('comments')
  .controller('commentsCtrl', commentsCtrl);
  
})();