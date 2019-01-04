(function() {
  function registrationCtrl($location, authentication) {
    var vm = this;

    vm.registerData = {
      name: "",
      mail: "",
      pass: ""
    };

    vm.firstToDisplay = $location.search().page || '/';
    
    vm.sendContent = function() {
        vm.error = "";
        if (!vm.registerData.name || !vm.registerData.mail || !vm.registerData.pass) {
          vm.error = "Enter all the data!";
          return false;
        } else {
          vm.register();
        }
      };

    vm.register = function() {
        vm.error = "";
      
        authentication
          .registration(vm.registerData)
          .then(
            function(success) {
              $location.search('login', null);
              $location.path(vm.firstToDisplay);
            },
            function(error) {
              vm.error = error.data;
            }
          );
    };
  }
  registrationCtrl.$inject = ['$location', 'authentication'];

  /* global angular */
  angular
    .module('comments')
    .controller('registrationCtrl', registrationCtrl);
})();