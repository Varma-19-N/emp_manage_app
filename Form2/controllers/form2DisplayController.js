/**
 * Simple controller for the greeting feature.
 */
angular.module('form2Module')
  .controller('form2DisplayController', function ($scope, greetingService, greetingModel) {

    // Initialize the greeting model
    $scope.greetingData = angular.copy(greetingModel);
    $scope.currentGreeting = '';

    /**
     * Generates and displays greeting when name changes
     */
    $scope.$watch('greetingData.userName', function(newValue) {
      if (newValue && newValue.trim() !== '') {
        $scope.currentGreeting = greetingService.generateGreeting(newValue);
        $scope.greetingData.showGreeting = true;
      } else {
        $scope.currentGreeting = '';
        $scope.greetingData.showGreeting = false;
      }
    });

    /**
     * Clears the form
     */
    $scope.clearForm = function() {
      $scope.greetingData = angular.copy(greetingModel);
      $scope.currentGreeting = '';
    };
  });