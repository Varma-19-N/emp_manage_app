// Service for fetching employee data from the backend
angular.module('viewEmployeeDetailsFormModule')
  .service('viewEmployeeDataFetchService', function($http, $timeout) {

    const baseApiUrl = 'http://192.168.0.51:5092/api/EmployeeDetails';
    const loggedUserID = 3068;

    // Fetches all employee details from the backend API
    this.fetchAllEmployeeDetailsFromBackend = function() {
      const apiUrl = `${baseApiUrl}/get?loggedUserID=${loggedUserID}`;
      
      console.log("Fetching employee data from:", apiUrl);

      return $http({
        method: 'GET',
        url: apiUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(function(response) {
        console.log("Data fetched successfully:", response);
        return response.data;
      })
      .catch(function(error) {
        console.error('Failed to fetch employee data:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          data: error.data
        });
        throw error;
      });
    };

    // Add new employee record
    this.addEmployeeRecord = function(employeeData) {
      const apiUrl = `${baseApiUrl}/add`;
      
      console.log("Adding employee:", employeeData);

      return $http({
        method: 'POST',
        url: apiUrl,
        data: employeeData,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(function(response) {
        console.log("Employee added successfully:", response);
        return response.data;
      })
      .catch(function(error) {
        console.error('Failed to add employee:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          data: error.data
        });
        throw error;
      });
    };

    // Update existing employee record
    this.updateEmployeeRecord = function(employeeData) {
      const apiUrl = `${baseApiUrl}/update`;
      
      console.log("Updating employee:", employeeData);

      return $http({
        method: 'PUT',
        url: apiUrl,
        data: employeeData,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(function(response) {
        console.log("Employee updated successfully:", response);
        return response.data;
      })
      .catch(function(error) {
        console.error('Failed to update employee:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          data: error.data
        });
        throw error;
      });
    };

    // Delete employee record
    this.deleteEmployeeRecord = function(employeeID) {
      const apiUrl = `${baseApiUrl}/delete?employeeID=${employeeID}&loggedUserID=${loggedUserID}`;
      
      console.log("Deleting employee ID:", employeeID);

      return $http({
        method: 'DELETE',
        url: apiUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(function(response) {
        console.log("Employee deleted successfully:", response);
        return response.data;
      })
      .catch(function(error) {
        console.error('Failed to delete employee:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          data: error.data
        });
        throw error;
      });
    };
});