/**
 * Defines the default structure of the employee form data.
 * This constant is injected into the controller and used to initialize and reset the form.
 */
angular.module('employeeDetailsFormModule')
  .constant('defaultEmployeeFormModel', {
    personalDetails: {
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    }
  });
