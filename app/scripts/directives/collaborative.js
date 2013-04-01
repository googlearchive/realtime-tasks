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

angular.module('todos').directive('collaborative',
  /**
   * Directive for adding cursor management to text fields bound to
   * collaboraative strings. Regular data binding works fine without it,
   * but remote updates will not properly maintain the cursor. Including
   * this directive ensures correct logical positioning of the cursor
   * on active fields.
   *
   * @returns {{restrict: string, scope: boolean, require: string, compile: Function}}
   */
  function () {
    /**
     * Handles the cursor management for a text field.
     *
     * @param scope
     * @param element
     * @param string
     * @param controller
     * @constructor
     */
    var TextBinder = function (scope, element, string, controller) {
      this.element = element;
      this.string = string;
      this.scope = scope;

      this._insertListener = angular.bind(this, function (event) {
        if (!event.isLocal) {
          this.updateText(event.index, event.text.length);
        }
      });
      this._deleteListener = angular.bind(this, function (event) {
        if (!event.isLocal) {
          this.updateText(event.index, -event.text.length);
        }
      });
      this.updateText = function (position, size) {
        var element = this.element[0];
        var isActive = (element === document.activeElement);
        if (isActive) {
          var value = this.string.text;
          var selectionStart = element.selectionStart;
          var selectionEnd = element.selectionEnd;

          if (position <= selectionStart) {
            selectionStart += size;
          }
          if (position < selectionEnd) {
            selectionEnd += size;
          }
          if (selectionEnd < selectionStart) {
            selectionEnd = selectionStart;
          }

          scope.$apply(function () {
            // Copied from ngModelController
            var formatters = controller.$formatters;
            var idx = formatters.length;

            controller.$modelValue = value;
            while (idx--) {
              value = formatters[idx](value);
            }

            if (controller.$viewValue !== value) {
              controller.$viewValue = value;
              controller.$render();
            }
            element.setSelectionRange(selectionStart, selectionEnd);
          });

        }
      };

      this.unbind = function () {
        console.log('Removing listeners');
        this.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this._insertListener);
        this.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this._deleteListener);
      };

      this.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this._insertListener);
      this.string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this._deleteListener);
    };

    return {
      restrict: 'A',
      scope: false,
      require: 'ngModel',
      compile: function (tElement, tAttrs) {
        var expression = tAttrs.ngModel.replace(/\.text$/, '');
        if (expression === tAttrs.ngModel) {
          console.log('Model does not appear to be collaborative string. Bind ng-model to .text property');
          return null;
        }
        return function (scope, iElement, iAttrs, controller) {
          scope.$watch(expression, function (newValue) {
            if (scope.binder) {
              scope.binder.unbind();
            }
            if (newValue) {
              scope.binder = new TextBinder(scope, iElement, newValue, controller);
            }
          });
          scope.$on('$destroy', function () {
            if (scope.binder) {
              scope.binder.unbind();
              scope.binder = null;
            }
          });
        };
      }
    };
  }
);
