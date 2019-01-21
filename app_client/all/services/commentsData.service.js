(function() {
  function commentsData($http, authentication) {
    
    var data = function(){
        return $http.get('/api/comments');
                };
                
    var commentById = function(commentId) {
      return $http.get('/api/comments/' + commentId);
    };
    
    var commentByUsername = function(username){
      return $http.get('/api/search/comments',{
        params: { name: username }
      });
    };
    
    var editCommentById = function(id, comment) {
      return $http.post('/api/comments/edit/' + id, comment, {
        headers: {
          Authorization: 'Bearer ' + authentication.returnToken()
        }});
    };
    
    var newComment = function(comment) {
      return $http.post('/api/comments/new', comment , {
        headers: {
          Authorization: 'Bearer ' + authentication.returnToken()
        }});
    };
    
    var deleteById = function(id) {
      var user = authentication.currUser();
      return $http.delete('/api/comments/' + id, {
        headers: {
          Authorization: 'Bearer ' + authentication.returnToken()
        }
      });
    };
    
    /* Returns a comments' page. */
    var getCommentsPage = function(pageSpec) {
      return $http.get('/api/comments', {
        params: pageSpec
      });
    };

    /* Returns number of pages and comments. */
    var getCommentsCount = function(search) {
      return $http.get('/api/comments-count', {
      });
    };
  
    return {
      'comments': data,
      'commentById': commentById,
      'editCommentById': editCommentById,
      'deleteById': deleteById,
      'newComment': newComment,
      'getCommentsPage': getCommentsPage,
      'getCommentsCount': getCommentsCount,
      'commentByUsername': commentByUsername
    };
  }
  commentsData.$inject = ['$http', 'authentication'];
  
  /* global angular */
  angular
    .module('comments')
    .service('commentsData', commentsData);
})();