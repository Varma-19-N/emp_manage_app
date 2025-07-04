// Service for fetching employee data from the backend
angular.module('viewEmployeeDetailsFormModule')
  .service('viewEmployeeDataFetchService', function($http, $timeout) {

    // Fetches all employee details from the backend API
    this.fetchAllEmployeeDetailsFromBackend = function() {
      // API endpoint for fetching employee details
      const backendApiUrl = 'http://192.168.0.51:5092/api/EmployeeDetails/get?loggedUserID=3068';

      console.log("Fetching employee data from:", backendApiUrl);

      // Make a GET request to the backend API
      return $http({
        method: 'GET',
        url: backendApiUrl,
        timeout: 10000, // Timeout set to 10 seconds
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
          'Accept': 'application/json' // Expect JSON response
        }
      })
      .then(function(response) {
        console.log("Data fetched successfully:", response);
        return response.data; // Return the employee data array from the response
      })
      .catch(function(error) {
        console.error('Failed to fetch employee data:', error);
        console.error('Error details:', {
          status: error.status, // Log the HTTP status code
          statusText: error.statusText, // Log the status text
          data: error.data // Log the error data
        });
        throw error; // Re-throw the error to be handled by the controller
      });
    };
});


