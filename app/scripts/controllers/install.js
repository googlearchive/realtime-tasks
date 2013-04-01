/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
