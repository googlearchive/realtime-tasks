angular.module('todos').directive ('onBlur', function() {
    /**
     * Directive that excutes an expression when the element is blurred
     */
    return function (scope, element, attributes) {
        element.bind("blur", function() {
            if(!element.is(':hidden')) {
                scope.$apply(attributes["onBlur"]);
            }
        });
        element.bind("keypress", function(event) {
            if (event.which == 13 ) {
                scope.$apply(attributes["onBlur"]);
            }
        });
    }
});