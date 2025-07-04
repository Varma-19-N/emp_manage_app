// This file contains the routing configuration for the Employee Management Application.
// It uses AngularJS UI-Router to define application states and views.

angular.module('employeeManagementMainApplicationModule', [
  'ui.router', 
  'employeeDetailsFormModule', 
  'form2Module',
  'viewEmployeeDetailsFormModule'
])

.config(function($stateProvider, $urlRouterProvider) {
  
  // Redirect to Employee Form by default on application load
  $urlRouterProvider.otherwise('/employee-details');

  // Define all application states (routes)
  $stateProvider
    // Route for Employee Details Form (Form1)
    .state('employeeDetailsFormState', {
      url: '/employee-details',
      templateUrl: 'EmployeeDetailsForm/templates/employeeDetailsForm.html',
      controller: 'employeeDetailsFormController'
    })

    // Route for Form2 Placeholder
    .state('form2DisplayState', {
      url: '/form2',
      templateUrl: 'Form2/templates/form2.html',
      controller: 'form2DisplayController'
    })

    // Route for View Employee Details Form (Form3)
    .state('viewEmployeeDetailsState', {
      url: '/view-employee-details',
      templateUrl: 'ViewEmployeeDetailsForm/templates/viewEmployeeDetailsGrid.html',
      controller: 'ViewEmployeeDetailsGridController'
    });
});
