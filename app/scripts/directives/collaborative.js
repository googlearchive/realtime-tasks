angular.module('todos').directive('collaborative', function () {

    var TextBinder = function (scope, element, string, controller) {
        this.element = element;
        this.string = string;
        this.scope = scope;

        this._insertListener = angular.bind(this, function (event) {
            if (!event.isLocal) {
                this.updateText(event.index, event.text.length, event.isLocal);
            }
        });
        this._deleteListener = angular.bind(this, function (event) {
            if (!event.isLocal) {
                this.updateText(event.index, -event.text.length, event.isLocal);
            }
        });
        this.updateText = function (position, size, isLocal) {
            var element = this.element[0];
            var isActive = (element == document.activeElement);
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
            console.log("Removing listeners");
            this.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this._insertListener);
            this.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this._deleteListener);
        };

        this.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this._insertListener);
        this.string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this._deleteListener);
    };

    return {
        restrict:'A',
        scope:false,
        require:'ngModel',
        compile:function (tElement, tAttrs, transclude) {
            var expression = tAttrs['ngModel'].replace(/\.text$/, '');
            if (expression == tAttrs['ngModel']) {
                console.log("Model does not appear to be collaborative string. Bind ng-model to .text property");
                return null;
            }
            return function (scope, iElement, iAttrs, controller) {
                scope.$watch(expression, function (newValue, oldValue) {
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
            }
        }
    }
});
