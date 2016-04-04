/* global FastClick, smoothScroll */
(function(angular) {
  angular.module('skilly', ['ui.bootstrap', 'plunker', 'ngTouch', 'ngAnimate', 'ngSanitize'], function($httpProvider) {
    FastClick.attach(document.body);
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }).run(['$location', function($location) {
    //Allows us to navigate to the correct element on initialization
    if ($location.path() !== '' && $location.path() !== '/') {
      smoothScroll(document.getElementById($location.path().substring(1)), 500, function(el) {
        location.replace('#' + el.id);
      });
    }
  }]).factory('buildFilesService', function($http, $q) {

    var moduleMap;
    var rawFiles;

    return {
      getModuleMap: getModuleMap,
      getRawFiles: getRawFiles,
      get: function() {
        return $q.all({
          moduleMap: getModuleMap(),
          rawFiles: getRawFiles()
        });
      }
    };

    function getModuleMap() {
      return moduleMap ? $q.when(moduleMap) : $http.get('assets/module-mapping.json')
        .then(function(result) {
          moduleMap = result.data;
          return moduleMap;
        });
    }

    function getRawFiles() {
      return rawFiles ? $q.when(rawFiles) : $http.get('assets/raw-files.json')
        .then(function(result) {
          rawFiles = result.data;
          return rawFiles;
        });
    }

  });

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
          $.map(response2.data, function(theResponse) {
            user.skills = theResponse.skills;
            user.skillsVisible  = true;
            self.info.push(user);
          });

        }, function errorCallback2(response2) {

        });
      });
    }, function errorCallback(response) {

    });

  }]);
})(window.angular);
