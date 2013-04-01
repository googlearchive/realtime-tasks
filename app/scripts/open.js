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

(/**
 * Small interceptor to rewrite Drive's open/create requests into
 * friendly URLS for our app.
 */
  function () {
  var params = {};
  window.location.search.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
    function ($0, $1, $2, $3) {
      params[decodeURIComponent($1)] = decodeURIComponent($3);
    }
  );

  if (params.state) {
    var state = JSON.parse(params.state);
    var path;
    if (state.action === 'create') {
      path = '/create';
    } else if (state.action === 'open') {
      var id = state.ids.shift();
      path = '/todos/' + id + '/';
    } else {
      path = '/install';
    }
    var url = window.location.pathname + '#' + path + '?user=' + state.userId;
    window.history.replaceState({}, '', url);
  }
})();