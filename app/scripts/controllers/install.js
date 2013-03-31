'use strict';

angular.module('todos').controller('InstallCtrl', ['$scope', '$location', 'storage',
  /**
   * Controller for installing the app and/or re-authorizing access.
   *
   * @param {angular.Scope} $scope
   * @param {angular.$location} $location
   * @param storage
   * @constructor
   */
    function ($scope, $location, storage) {

    /**
     * Requests authorization from the user. Redirects to the previous target
     * or to create a new doc if no other action once complete.
     */
    $scope.authorize = function () {
      storage.requireAuth(false).then(function () {
        var target = $location.search().target;
        if (target) {
          $location.url(target);
        } else {
          $location.url('/create');
        }
      });
    };
  }]
);
