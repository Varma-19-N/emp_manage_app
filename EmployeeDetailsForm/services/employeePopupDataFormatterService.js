// AngularJS service that handles conversion of employee data into formatted JSON
angular
  .module("employeeDetailsFormModule")
  .service("employeePopupDataFormatterService", function () {
    /**
     * Converts the employee object into a formatted JSON string.
     * @param {Object} employeeData - The employee object from the form.
     * @returns {string} A prettified JSON string.
     */
    this.formatEmployeeDataAsJson = function (employeeData) {
      // Create a deep copy to avoid mutating the original form object
      var formattedData = angular.copy(employeeData);

      // Format the DOB to "YYYY-MM-DD" format (from ISO string)
      if (formattedData.personalDetails.dob) {
        formattedData.personalDetails.dob = new Date(formattedData.personalDetails.dob).toISOString().split("T")[0];
      }

      // Return prettified JSON
      return JSON.stringify(formattedData, null, 2);
    };
  });
