var myApp = angular.module('skilly');


myApp.controller('navController', ['$scope', '$cookieStore', 'UserService', '$cookies', function($scope, $cookieStore, UserService, $cookies) {
  var self = this;
  if ($cookies.get('id')) {
    self.isLogged = true;
  } else self.isLogged = false;
console.log($scope);
  $scope.$on("userLoggedIn",function(event,args) {
     self.isLogged = true;
});

$scope.$on("userLoggedOut",function(event,args) {
   self.isLogged = false;
});

}]);
