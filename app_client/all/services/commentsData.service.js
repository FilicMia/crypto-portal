(function() {
  function commentsData($http, authentication) {
    
    var data = function(){
        return $http.get('/api/comments');
                };
                
    var commentById = function(commentId) {
      return $http.get('/api/comments/' + commentId);
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
    
    var deleteById = function(id, username) {
      return $http.delete('/api/comments/' + id, username, {
        headers: {
          Authorization: 'Bearer ' + authentication.returnToken()
        }
      });
    };
  
    return {
      'comments': data,
      'commentById': commentById,
      'editCommentById': editCommentById,
      'deleteById': deleteById,
      'newComment': newComment
    };
  }
  commentsData.$inject = ['$http', 'authentication'];
  
  /* global angular */
  angular
    .module('comments')
    .service('commentsData', commentsData);
})();