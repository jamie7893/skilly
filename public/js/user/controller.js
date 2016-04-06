/* global FastClick, smoothScroll */
(function(angular) {

  var myApp = angular.module('skilly');


  myApp.controller('GetUser', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
    var self = this;
    self.info = [];

    self.toggleSkillsVisible = function(user) {
      user.skillsVisible = !user.skillsVisible;
    };
    $http({
      method: 'GET',
      url: '/user'
    }).then(function successCallback(response) {
      $.map(response.data, function(user) {
        if(user.id == $cookies.get('id'))
        $http({
          method: 'GET',
          url: '/user/' + user.id + '/profile'
        }).then(function successCallback2(response2) {
          $.map(response2.data, function(theResponse) {
            user.skills = theResponse.skills;
            user.skillsVisible = true;
            self.info.push(user);
          });

        }, function errorCallback2(response2) {

        });
      });
    }, function errorCallback(response) {

    });

  }]);

})(window.angular);
