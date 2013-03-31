

angular.module("todos").controller('CreateCtrl', ['$scope', '$location', 'storage',
    /**
     * Controller for creating new documents
     *
     * @param {angular.Scope} $scope
     * @param {angular.$location} $location
     * @param {!object} storage
     * @constructor
     */
    function ($scope, $location, storage) {
        $scope.message = "Please wait";
        storage.requireAuth().then(function() {
            storage.createDocument('New Project').then(function (file) {
                $location.url('/todos/'+file.id+'/');
            });
        }, function () {
            $location.url('/install?target=' + encodeURIComponent($location.url()));
        });
    }]
);
