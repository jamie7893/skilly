(function(angular) {
  'use strict';
  angular.module('skilly', ['mgcrea.ngStrap']);
  var myApp = angular.module('skilly');

  myApp.factory('mainInfo', function($http) {

  });

  myApp.controller('GetAllUsers', ['$scope', '$http', function($scope, $http) {
    var self = this;
    $http({
    method: 'GET',
    url: 'http://localhost:1738/user'
  }).then(function successCallback(response) {

    var auser = $.map(response.data, function(data) {
    });
    self.users = response.data;
        console.log(response.data);
    }, function errorCallback(response) {

    });
  }]);




})(window.angular);
