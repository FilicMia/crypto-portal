(function() {

//specification of the router provider.
function provider($routeProvider, $locationProvider) {

    $routeProvider
    .when('/', {
        templateUrl: 'comments/comments.view.html',
        controller: 'commentsCtrl',
        controllerAs: 'vm'
    })
    .when('/comments/:idComment', {
        templateUrl: 'comments/commentViewing/commentView.view.html',
        controller: 'commentsViewCtrl',
        controllerAs: 'vm'
    })
    .when('/registration', {
      templateUrl: '/auth/registration/registration.view.html',
      controller: 'registrationCtrl',
      controllerAs: 'vm'
    })
    .when('/login', {
      templateUrl: '/auth/login/login.view.html',
      controller: 'loginCtrl',
      controllerAs: 'vm'
    })
    .when('/404', {
      templateUrl: 'error/404.template.html'
    })
    .otherwise({
        redirectTo: '/404'
    });
    
    //Remove #:
    //1.We will use the $locationProvider module and set html5Mode to true.
    //2. then remove all preceding # for relative routes (i.e. '#/comments' 
    //to '/comments')
    //3. put base in html head tag, like: `base(href='/')`
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
}

/* global angular */
angular
    .module('comments',['ngRoute', 'ui.bootstrap'])
    .config(['$routeProvider','$locationProvider',provider]);
})();