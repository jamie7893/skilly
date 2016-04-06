/* global FastClick, smoothScroll */
(function(angular) {
  angular.module('skilly', ['ngAnimate', 'ngSanitize', 'ngRoute', 'ngCookies', 'skilly.register', 'skilly.login']);

  var myApp = angular.module('skilly');

  myApp
    .config(config);

  config.$inject = ['$routeProvider', '$locationProvider'];

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'GetAllUsers',
        templateUrl: 'templates/home.html'
      })

      .when('/profile', {
        controller: 'GetUser',
        templateUrl: 'templates/profile.html'
      })

      .when('/edit', {
        controller: 'EditProfileController',
        templateUrl: 'templates/editProfile.html'
      })
      .when('/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterController'
      })
      .when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      })

    .otherwise({
      redirectTo: '/'
    });
  }

})(window.angular);
