angular.module("todos").controller('MainCtrl', ['$scope', '$routeParams', 'realtimeDocument',
    /**
     * Controller for editing the tasks lists
     *
     * @param {angular.Scope} $scope
     * @param {angular.$routeParams} $routeParams
     * @param document
     * @constructor
     */
    function ($scope, $routeParams, document) {
        $scope.fileId = $routeParams.fileId;
        $scope.filter = $routeParams.filter;

        $scope.document = document;
        $scope.todos = document.getModel().getRoot().get('todos');
        $scope.newTodo = '';


        /**
         * Count the number of incomplete todo items.
         *
         * @returns {number}
         */
        $scope.remainingCount = function() {
            var remaining = 0;
            angular.forEach(this.todos.asArray(), function(todo) {
                remaining += todo.completed ? 0 : 1;
            });
            return remaining;
        };

        /**
         * Add a new todo item to the list, resets the new item text.
         */
        $scope.addTodo = function() {
            if (this.newTodo) {
                var todo = document.getModel().create(app.Todo, this.newTodo);
                this.newTodo = '';
                this.todos.push(todo);
            }
        };

        /**
         * Begin editing of an item.
         */
        $scope.editTodo = function( todo ) {
            $scope.editedTodo = todo;
        };

        /**
         * Cancel editing.
         */
        $scope.doneEditing = function() {
            $scope.editedTodo = null;
        };

        /**
         * Delete an individual todo by removing it from the list.
         *
         * @param todo
         */
        $scope.removeTodo = function( todo ) {
            this.todos.removeValue(todo);
        };

        /**
         * Remove all completed todos from the list
         */
        $scope.clearDoneTodos = function() {
            var todos = this.todos;
            angular.forEach(this.todos.asArray(), function(todo) {
                if (todo.completed) {
                    todos.removeValue(todo);
                }
            });
        };

        /**
         * Toggle the completed status of all items.
         *
         * @param done
         */
        $scope.markAll = function( done ) {
            angular.forEach(this.todos.asArray(), function(todo) {
                todo.completed = true;
            });
        };

        $scope.$watch('filter', function( filter ) {
            $scope.statusFilter = (filter == 'active') ?
            { completed: false } : (filter == 'completed') ?
            { completed: true } : null;
        });


    }]
);

angular.module('todos').controller('CollaboratorsCtrl', ['$scope',
    /**
     * Controller for displaying the list of current collaborators. Expects
     * to inherit the document from a parent scope.
     *
     * @param {angular.Scope} $scope
     * @constructor
     */
    function($scope) {
        var collaboratorListener = function(event) {
            $scope.$apply(function() {
                $scope.collaborators = $scope.document.getCollaborators();
            });
        };
        $scope.collaborators = $scope.document.getCollaborators();

        $scope.document.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, collaboratorListener);
        $scope.document.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, collaboratorListener);

        $scope.$on('$destroy', function() {
            var doc = $scope.document;
            if (doc) {
                document.removeEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, collaboratorListener);
                document.removeEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, collaboratorListener);
            }
        });

    }]
);
