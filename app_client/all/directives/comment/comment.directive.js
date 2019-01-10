
(function(){
    // directive for reusability of components
    var comment = function($uibModal) {

        return {
            restrict: 'EA',
            scope: {commentdirective: "=onecomment",
                    onclick: "&onclickf"
            },
            templateUrl: "/all/directives/comment/comment.view.html",
            controller: "commentDirCtrl",
            controllerAs: "commdirvm"
            
        };
    };
    
    comment.$inject = ['$uibModal'];
    
    //dodati kontrolerja aplikaciji
    //no cammel case in the view when calling directive (only with -)
    /* global angular */
    angular
    .module("comments")
    .directive("comment", comment);

})();

