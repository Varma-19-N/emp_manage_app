// Service for fetching employee data from the backend with complete CRUD operations
angular.module('viewEmployeeDetailsFormModule')
  .service('viewEmployeeDataFetchService', function($http) {

    const baseApiUrl = 'http://192.168.0.51:5092/api/EmployeeDetails';
    const loggedUserID = 3068;

    // Common HTTP configuration
    const httpConfig = {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    // Fetches all employee details from the backend API
    this.fetchAllEmployeeDetailsFromBackend = function() {
      const apiUrl = `${baseApiUrl}/get?loggedUserID=${loggedUserID}`;
      
      console.log("Fetching employee data from:", apiUrl);

      return $http.get(apiUrl, httpConfig)
        .then(function(response) {
          console.log("Data fetched successfully:", response);
          return response.data || [];
        })
        .catch(function(error) {
          console.error('Failed to fetch employee data:', error);
          throw {
            message: 'Failed to load employee data',
            details: error
          };
        });
    };

    // Add new employee record - matching exact database structure
    this.addEmployeeRecord = function(employeeData) {
      const apiUrl = `${baseApiUrl}/add`;
      
      // Prepare employee data object matching exact database structure
      const employeePayload = {
        employee_FirstName: employeeData.employee_FirstName || '',
        employee_LastName: employeeData.employee_LastName || '',
        employee_DateofBirth: employeeData.employee_DateofBirth ? new Date(employeeData.employee_DateofBirth).toISOString() : null,
        employee_DateofJoining: employeeData.employee_DateofJoining ? new Date(employeeData.employee_DateofJoining).toISOString() : null,
        employee_Department: employeeData.employee_Department || '',
        employee_Salary: parseFloat(employeeData.employee_Salary) || 0,
        employee_InActive: employeeData.employee_InActive ? 1 : 0, // Convert boolean to int
        employee_CreatedBy: loggedUserID,
        employee_ModifiedBy: null
      };
      
      console.log("Adding employee with data:", employeePayload);

      return $http.post(apiUrl, employeePayload, httpConfig)
        .then(function(response) {
          console.log("Employee added successfully:", response);
          return response.data;
        })
        .catch(function(error) {
          console.error('Failed to add employee:', error);
          let errorMessage = 'Failed to add employee';
          
          if (error.data && error.data.message) {
            errorMessage = error.data.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid employee data provided';
          } else if (error.status === 500) {
            errorMessage = 'Server error occurred while adding employee';
          }
          
          throw {
            message: errorMessage,
            details: error
          };
        });
    };

    // Update existing employee record - matching exact database structure
    this.updateEmployeeRecord = function(employeeData) {
      const apiUrl = `${baseApiUrl}/update`;
      
      // Prepare employee data object for update matching exact database structure
      const employeePayload = {
        employeeID: employeeData.employeeID,
        employee_FirstName: employeeData.employee_FirstName || '',
        employee_LastName: employeeData.employee_LastName || '',
        employee_DateofBirth: employeeData.employee_DateofBirth ? new Date(employeeData.employee_DateofBirth).toISOString() : null,
        employee_DateofJoining: employeeData.employee_DateofJoining ? new Date(employeeData.employee_DateofJoining).toISOString() : null,
        employee_Department: employeeData.employee_Department || '',
        employee_Salary: parseFloat(employeeData.employee_Salary) || 0,
        employee_InActive: employeeData.employee_InActive ? 1 : 0, // Convert boolean to int
        employee_CreatedOn: employeeData.employee_CreatedOn, // Preserve original
        employee_CreatedBy: employeeData.employee_CreatedBy, // Preserve original
        employee_ModifiedBy: loggedUserID
      };
      
      console.log("Updating employee with data:", employeePayload);

      return $http.put(apiUrl, employeePayload, httpConfig)
        .then(function(response) {
          console.log("Employee updated successfully:", response);
          return response.data;
        })
        .catch(function(error) {
          console.error('Failed to update employee:', error);
          let errorMessage = 'Failed to update employee';
          
          if (error.data && error.data.message) {
            errorMessage = error.data.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid employee data provided';
          } else if (error.status === 404) {
            errorMessage = 'Employee not found';
          } else if (error.status === 500) {
            errorMessage = 'Server error occurred while updating employee';
          }
          
          throw {
            message: errorMessage,
            details: error
          };
        });
    };

    // Delete employee record
    this.deleteEmployeeRecord = function(employeeID) {
      const apiUrl = `${baseApiUrl}/delete?employeeID=${employeeID}&loggedUserID=${loggedUserID}`;
      
      console.log("Deleting employee ID:", employeeID);

      return $http.delete(apiUrl, httpConfig)
        .then(function(response) {
          console.log("Employee deleted successfully:", response);
          return response.data;
        })
        .catch(function(error) {
          console.error('Failed to delete employee:', error);
          let errorMessage = 'Failed to delete employee';
          
          if (error.data && error.data.message) {
            errorMessage = error.data.message;
          } else if (error.status === 404) {
            errorMessage = 'Employee not found';
          } else if (error.status === 500) {
            errorMessage = 'Server error occurred while deleting employee';
          }
          
          throw {
            message: errorMessage,
            details: error
          };
        });
    };

    // Validate employee data before sending to backend
    this.validateEmployeeData = function(employeeData) {
      const errors = [];
      
      // Required field validations based on database structure
      if (!employeeData.employee_FirstName || !employeeData.employee_FirstName.trim()) {
        errors.push('First Name is required');
      }
      
      if (!employeeData.employee_LastName || !employeeData.employee_LastName.trim()) {
        errors.push('Last Name is required');
      }
      
      if (!employeeData.employee_DateofBirth) {
        errors.push('Date of Birth is required');
      }
      
      if (!employeeData.employee_DateofJoining) {
        errors.push('Date of Joining is required');
      }
      
      if (!employeeData.employee_Department || !employeeData.employee_Department.trim()) {
        errors.push('Department is required');
      }
      
      if (!employeeData.employee_Salary || employeeData.employee_Salary <= 0) {
        errors.push('Valid salary is required');
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors
      };
    };
  });