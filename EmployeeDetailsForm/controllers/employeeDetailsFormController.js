/**
 * Controller for managing the Employee Save Details Form.
 * Integrates model-based default structure, progressive validation, popup via service,
 * and full form reset and submission handling.
 */
angular.module('employeeDetailsFormModule')
  .controller('employeeDetailsFormController', function (
    $scope,
    employeePopupDataFormatterService,
    defaultEmployeeFormModel
  ) {
    // Employee object initialized from model (clean, reusable structure)
    $scope.employee = angular.copy(defaultEmployeeFormModel);

    // UI state flags
    $scope.successMessageVisible = false;
    $scope.employeeDataPopupVisible = false;
    $scope.formattedEmployeeJson = '';

    // Defines the sequence of fields for step-by-step validation
    $scope.formFieldValidationSequence = [
      'employeeFirstName', 'employeeLastName', 'employeeEmail',
      'employeeDob', 'employeeGender',
      'street', 'city', 'state', 'country', 'postalCode'
    ];

    /**
     * Validates all fields that appear before the current input.
     * Helps catch missed fields in a progressive order.
     */
    $scope.validateFieldsBefore = function (currentFieldName) {
      const currentIndex = $scope.formFieldValidationSequence.indexOf(currentFieldName);
      if (currentIndex === -1) return;

      $scope.formFieldValidationSequence.slice(0, currentIndex).forEach(function (fieldName) {
        const control = $scope.employeeSaveDetailsForm[fieldName];
        if (control && !control.$touched) {
          control.$setTouched();
        }
      });
    };

    /**
     * Prevents non-digit characters in the Postal Code input.
     */
    $scope.allowOnlyDigitCharacters = function ($event) {
      const typedCharacter = String.fromCharCode($event.which || $event.keyCode);
      if (!/^\d$/.test(typedCharacter)) {
        $event.preventDefault();
      }
    };

    /**
     * Validates and submits the form. Displays formatted JSON in popup.
     */
    $scope.submitEmployeeDetailsForm = function (formReference) {
      $scope.employeeSaveDetailsForm = formReference;

      // Mark all fields as touched to show errors if present
      angular.forEach(formReference, function (control, name) {
        if (name[0] !== '$') {
          control.$setTouched();
        }
      });

      // If form is valid, show popup and format employee data
      if (formReference.$valid) {
        $scope.successMessageVisible = true;
        $scope.employeeDataPopupVisible = true;
        $scope.formattedEmployeeJson = employeePopupDataFormatterService.formatEmployeeDataAsJson($scope.employee);
      }
    };

    /**
     * Resets the form and UI to its initial state using the model.
     */
    $scope.resetEmployeeDetailsForm = function () {
      $scope.employee = angular.copy(defaultEmployeeFormModel);
      $scope.successMessageVisible = false;
      $scope.employeeDataPopupVisible = false;
      $scope.employeeSaveDetailsForm.$setPristine();
      $scope.employeeSaveDetailsForm.$setUntouched();
    };

    /**
     * Closes the popup window.
     */
    $scope.closePopup = function () {
      $scope.employeeDataPopupVisible = false;
    };
  });
