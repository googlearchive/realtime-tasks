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

angular.module('todos').controller('CreateCtrl', ['$scope', '$location', 'storage',
  /**
   * Controller for creating new documents
   *
   * @param {angular.Scope} $scope
   * @param {angular.$location} $location
   * @param {!object} storage
   * @constructor
   */
  function ($scope, $location, storage) {
    $scope.message = 'Please wait';
    storage.requireAuth().then(function () {
      storage.createDocument('New Project').then(function (file) {
        $location.url('/todos/' + file.id + '/');
      });
    }, function () {
      $location.url('/install?target=' + encodeURIComponent($location.url()));
    });
  }]
);
