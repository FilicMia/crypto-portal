(function() {
function commentsCtrl(commentsData, $location, $scope, authentication, $filter) {
  var vm = this;
  vm.title = 'Comments';
  vm.msg = "Searching comments...";
  
  vm.logedin = authentication.logedin();
  vm.user = authentication.currUser();
  
    /////////////////PAGINATION////////////////////////
    vm.currentPage = 0;
    vm.currentPageCached = 0;
    vm.pageSize = 10;
    vm.q = '';
    vm.dataSize = 0;
    vm.data = {};
    vm.data.comments = [];
    vm.data.count = {};
    vm.data.cached = [];
    vm.data.cacheIndexprevExtraPage = 0;
    vm.data.cacheIndexprevPage = 1;
    vm.data.cacheIndexcurrPage = 2;
    vm.data.cacheIndexnextPage = 3;
    
    vm.cacheLimit = 4;
     //////////////////////////////////////////
    // server side search activated.
    vm.search = false;
    
    
  
    vm.numberOfPages = function() {
      return vm.search ? Math.ceil(vm.getData().length/vm.pageSize) : vm.data.count.pages;
    };
    
    vm.clientSide = (vm.numberOfPages() <= vm.cacheLimit);
    
    var refreshPage = function(page){
      if(vm.clientSide){
        vm.currentPage = page;
        return;
      }
      
      var pageNo = page > 0 ? (page > 1 ? 4 : 3) : 2;
      vm.data.comments = '';
      vm.currentPage = page;
      page = pageNo > 2 ? (pageNo > 3 ? (page-2) : (page-1)) : page;
      commentsData.getCommentsPage({
        page: vm.currentPage,
        pageSize: vm.pageSize,
        pageNo: pageNo
      }).then(
          function succes(response){
            vm.msg = response.data.length > 0 ? "" : "No comments.";
            vm.data.cached = response.data;
            if(pageNo <= 2){
              vm.data.cached.unshift(response.data[0]);
            }
            
            if(pageNo <= 3){
              vm.data.cached.unshift(response.data[0]);
            }
            vm.data.comments = vm.data.cached[vm.data.cacheIndexcurrPage];

          },
          function error(response){
            vm.error = true;
            vm.msg = "Error while fetching comments.";
            console.log(response.e);
      });
      
    };
     
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
            
            //////////////////////////////////////////////////////////////////////////////
            if(vm.clientSide){
              vm.data.comments.unshift(response.data);
              return;
            }
            ///////////////////////////////////////////////////////////////////////////////
            
            //next page
            vm.data.cached.slice(-1)[0].unshift(vm.data.cached[vm.data.cacheIndexcurrPage].slice(-1)[0]);
            vm.data.cached.slice(-1)[0].pop();
            
            if(vm.currentPage == 0){
              vm.data.comments.unshift(response.data);
              //remove last
              vm.data.comments.pop();
        
              //curr page
              vm.data.cached[vm.data.cacheIndexcurrPage] = vm.data.comments;
            } else {
              //curr page
              vm.data.cached[vm.data.cacheIndexcurrPage].unshift(vm.data.cached[vm.data.cacheIndexprevPage].slice(-1)[0]);
              
              vm.data.cached[vm.data.cacheIndexcurrPage].pop();
              
              if(vm.currentPage == 1) {
                //prev page, 
                vm.data.cached[vm.data.cacheIndexprevPage].unshift(response.data);
                vm.data.cached[vm.data.cacheIndexprevPage].pop();
                
                //extra does not exists

              } else {
                //prev page
                vm.data.cached[vm.data.cacheIndexprevPage].unshift(vm.data.cached[vm.data.cacheIndexprevExtraPage].slice(-1)[0]);
                vm.data.cached[vm.data.cacheIndexprevPage].pop();
                
                if(vm.currentPage == 2) { 
                  //extraPage 
                  vm.data.cached[vm.data.cacheIndexprevExtraPage].unshift(response.data);
                  
                  vm.data.cached[vm.data.cacheIndexprevExtraPage].pop()
                } else {
                  
                  //now we have more that 0,1,2 pages so all of them exists. so when calling -1 page, extraPage will update accordingly.
                  
                  //If we go +1, it will do the same, not only in the case when there is exactly 4 pages, we are on cacle limit so no problem. and we are now on 3. Then, it will stay broken,
                }

              }
              
            }
            
            vm.newcomment.name = '';
            vm.newcomment.comment = '';
          },
          function error(response){
            vm.error = true;
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
            vm.error = true;
            vm.msg = "Error while fetching comments count.";
            console.log(response.e);
          }); 
    
    vm.getData = function() {
      return $filter('filter')(vm.data.comments, vm.q)
    }
    
    vm.getDataLenght = function() {
      return vm.data.count.size;
    }
    
    /////////////////////////GET NEXT PAGE//////////////////////////////////
    var getAndChangeNext = function(){
      if( vm.currentPage + 1 >= vm.numberOfPages()) {
        vm.data.cached[vm.data.cacheIndexnextPage] = vm.data.cached[vm.data.cacheIndexcurrPage];
        return;
      }
      
      commentsData.getCommentsPage({
          page: vm.currentPage + 1,
          pageSize: vm.pageSize
        }).then(
            function succes(response){
              vm.data.cached[vm.data.cacheIndexnextPage] = response.data[0]; //load new next
            },
            function error(response){
              vm.error = true;
              vm.msg = "Error while fetching comments.";
        });
      
    };
    
    /////////////////////////GET PREV PAGE//////////////////////////////////
    var getAndChangePrevExtra = function(){
      if( vm.currentPage - 2 < 0) {
        vm.data.cached[vm.data.cacheIndexprevExtraPage] = vm.data.cached[vm.data.cacheIndexprevPage];
        return;
      }
      
      commentsData.getCommentsPage({
          page: vm.currentPage - 2,
          pageSize: vm.pageSize
        }).then(
            function succes(response){
              vm.data.cached[vm.data.cacheIndexprevExtraPage] = response.data[0]; //load new next
            },
            function error(response){
              vm.error = true;
              vm.msg = "Error while fetching comments.";
              console.log(response.e);
        });
      
    };
    
    vm.next = function() {
      
      vm.currentPage = vm.currentPage + 1;
      if(vm.clientSide || vm.search) {
        return;
      }
      
      vm.data.comments = vm.data.cached[vm.data.cacheIndexnextPage];
      if(vm.data.comments.length > 0){
        //remove first
        vm.data.cached.shift();
        
        //
        vm.data.cached.push([]);
        getAndChangeNext();
      } else {
        refreshPage(vm.currentPage);
      }
    
    };
    
    vm.previous = function() {
      
      vm.currentPage = vm.currentPage - 1;
      if(vm.clientSide || vm.search) {
        return;
      }
      
      vm.data.comments = vm.data.cached[vm.data.cacheIndexprevPage];
      
      if(vm.data.comments.length > 0){
        //remove last
        vm.data.cached.pop();
        
        //
        vm.data.cached.unshift([]);
        getAndChangePrevExtra();
      } else {
        refreshPage(vm.currentPage);
      }
    };
    
    vm.serverSearch = function(username){
      if(username == '') return;
      
      vm.msg = "Server searches...";
      vm.currentPageCached = vm.currentPage;
      
      vm.currentPage = 0;
      commentsData.commentByUsername(username)
      .then(function succes(response){
            vm.data.comments = response.data;
            vm.search = true;
            vm.msg = '';
          },
          function error(response){
            vm.error = true;
            vm.msg = "Error while fetching comments.";
            console.log(response.e);
      });
      
    };
    
    vm.cancelSearch = function(){
      if(!vm.search) return;
      
      vm.msg = "Search is canceled. You can now add comment.";
      vm.searchname ='';
      vm.search = false;
      
      vm.currentPage = vm.currentPageCached;
      vm.data.comments = vm.data.cached[1];
    };
    
    $scope.redirectTo = function(comment){
        //redirectTo
         $location.url('/comments/'+comment._id);
        };
    
    if(!vm.data.comments.length){
      refreshPage(vm.currentPage);
    }
        
};

commentsCtrl.$inject = ['commentsData', '$location', '$scope', 'authentication', '$filter'];

/* global angular */
angular
  .module('comments')
  .controller('commentsCtrl', commentsCtrl);
  
})();