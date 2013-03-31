'use strict';

angular.module('todos').directive('focus', ['$timeout',
  /**
   * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
   */
    function ($timeout) {
    return function (scope, elem, attrs) {
      scope.$watch(attrs.focus, function (value) {
        if (value) {
          $timeout(function () {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  }]
);