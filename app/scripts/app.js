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

var CONFIG = {
  clientId: '502747173299.apps.googleusercontent.com',
  apiKey: 'AIzaSyA8uaDCmQ1mvhjXQZvF55vW9ygO_fAYKRs',
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.install'
  ]
};

var app = {};

app.module = angular.module('todos', []);

/**
 * A simple type for todo items.
 * @constructor
 */
app.Todo = function () {
};

/**
 * Initializer for constructing via the realtime API
 *
 * @param title
 */
app.Todo.prototype.initialize = function (title) {
  var model = gapi.drive.realtime.custom.getModel(this);
  this.title = model.createString(title);
  this.completed = false;
};


/**
 * Loads the document. Used to inject the collaborative document
 * into the main controller.
 *
 * @param $route
 * @param storage
 * @returns {*}
 */
app.loadFile = function ($route, storage) {
  var id = $route.current.params.fileId;
  var userId = $route.current.params.user;
  return storage.requireAuth(true, userId).then(function () {
    return storage.getDocument(id);
  });
};
app.loadFile.$inject = ['$route', 'storage'];

/**
 * Initialize our application routes
 */
app.module.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/todos/:fileId/:filter', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          realtimeDocument: app.loadFile
        }
      })
      .when('/create', {
        templateUrl: 'views/loading.html',
        controller: 'CreateCtrl'
      })
      .when('/install', {
        templateUrl: 'views/install.html',
        controller: 'InstallCtrl'
      })
      .otherwise({
        redirectTo: '/install'
      });
  }]
);

app.module.value('config', CONFIG);

/**
 * Set up handlers for various authorization issues that may arise if the access token
 * is revoked or expired.
 */
app.module.run(['$rootScope', '$location', 'storage', function ($rootScope, $location, storage) {
  // Error loading the document, likely due revoked access. Redirect back to home/install page
  $rootScope.$on('$routeChangeError', function () {
    $location.url('/install?target=' + encodeURIComponent($location.url()));
  });

  // Token expired, refresh
  $rootScope.$on('todos.token_refresh_required', function () {
    storage.requireAuth(true).then(function () {
      // no-op
    }, function () {
      $location.url('/install?target=' + encodeURIComponent($location.url()));
    });
  });
}]);

/**
 * Bootstrap the app
 */
gapi.load('auth:client:drive-share:drive-realtime', function () {
  gapi.auth.init();

  // Monkey patch collaborative string for ng-model compatibility
  Object.defineProperty(gapi.drive.realtime.CollaborativeString.prototype, 'text', {
    set: function (value) {
      return this.setText(value);
    },
    get: function () {
      return this.getText();
    }
  });

  // Register our Todo class
  app.Todo.prototype.title = gapi.drive.realtime.custom.collaborativeField('title');
  app.Todo.prototype.completed = gapi.drive.realtime.custom.collaborativeField('completed');
  gapi.drive.realtime.custom.registerType(app.Todo, 'todo');
  gapi.drive.realtime.custom.setInitializer(app.Todo, app.Todo.prototype.initialize);

  $(document).ready(function () {
    angular.bootstrap(document, ['todos']);
  });
});
