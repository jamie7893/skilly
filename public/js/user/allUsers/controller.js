/* global FastClick, smoothScroll */
(function(angular) {

  var myApp = angular.module('skilly');


  myApp.controller('GetAllUsers', ['$scope', '$http', function($scope, $http) {
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
        $http({
          method: 'GET',
          url: '/user/' + user.id + '/profile'
        }).then(function successCallback2(response2) {
          $http({
            method: 'GET',
            url: '/user/' + user.id + '/twitter'
          }).then(function successCallback(tweetResponse) {
            user.tweets = $.map(tweetResponse.data, function(tweet) {
                  return tweet.text;
            });


          $.map(response2.data, function(theResponse) {
            user.skills = theResponse.skills;
            user.skillsVisible = true;
            self.info.push(user);
          });
          });

        }, function errorCallback2(response2) {

        });
      });
    }, function errorCallback(response) {

    });
console.log(self.user);
  }]);

})(window.angular);
