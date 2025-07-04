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

      // Additional validations
      if (employeeData.employee_FirstName && employeeData.employee_FirstName.length > 50) {
        errors.push('First Name cannot exceed 50 characters');
      }

      if (employeeData.employee_LastName && employeeData.employee_LastName.length > 50) {
        errors.push('Last Name cannot exceed 50 characters');
      }

      if (employeeData.employee_Department && employeeData.employee_Department.length > 100) {
        errors.push('Department cannot exceed 100 characters');
      }

      // Date validations
      if (employeeData.employee_DateofBirth) {
        const birthDate = new Date(employeeData.employee_DateofBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (birthDate > today) {
          errors.push('Date of Birth cannot be in the future');
        }
        
        if (age < 18) {
          errors.push('Employee must be at least 18 years old');
        }
        
        if (age > 100) {
          errors.push('Please enter a valid Date of Birth');
        }
      }

      if (employeeData.employee_DateofJoining) {
        const joiningDate = new Date(employeeData.employee_DateofJoining);
        const today = new Date();
        
        if (joiningDate > today) {
          errors.push('Date of Joining cannot be in the future');
        }
      }

      // Cross-field validation
      if (employeeData.employee_DateofBirth && employeeData.employee_DateofJoining) {
        const birthDate = new Date(employeeData.employee_DateofBirth);
        const joiningDate = new Date(employeeData.employee_DateofJoining);
        
        if (joiningDate <= birthDate) {
          errors.push('Date of Joining must be after Date of Birth');
        }
      }

      // Salary validation
      if (employeeData.employee_Salary && (employeeData.employee_Salary < 0 || employeeData.employee_Salary > 10000000)) {
        errors.push('Salary must be between 0 and 10,000,000');
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors
      };
    };

    // Format date for display in grid
    this.formatDateForDisplay = function(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
      }
    };

    // Format date for input fields (YYYY-MM-DD)
    this.formatDateForInput = function(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error formatting date for input:', error);
        return '';
      }
    };

    // Get department list for dropdown
    this.getDepartmentList = function() {
      return [
        'IT',
        'HR',
        'Finance',
        'Marketing',
        'Operations',
        'Sales',
        'Trainee',
        'Management',
        'Engineering',
        'Quality Assurance',
        'Customer Service',
        'Research & Development'
      ];
    };

    // Calculate age from date of birth
    this.calculateAge = function(dateOfBirth) {
      if (!dateOfBirth) return null;
      
      try {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return age;
      } catch (error) {
        console.error('Error calculating age:', error);
        return null;
      }
    };

    // Format salary for display
    this.formatSalary = function(salary) {
      if (!salary && salary !== 0) return '';
      
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(salary);
      } catch (error) {
        console.error('Error formatting salary:', error);
        return salary.toString();
      }
    };

    // Check if employee is active
    this.isEmployeeActive = function(employee) {
      return !employee.employee_InActive || employee.employee_InActive === 0;
    };

    // Get employee status text
    this.getEmployeeStatusText = function(employee) {
      return this.isEmployeeActive(employee) ? 'Active' : 'Inactive';
    };

    // Search employees by criteria
    this.searchEmployees = function(employees, searchCriteria) {
      if (!searchCriteria || !searchCriteria.trim()) {
        return employees;
      }

      const searchTerm = searchCriteria.toLowerCase().trim();
      
      return employees.filter(function(employee) {
        return (
          (employee.employee_FirstName && employee.employee_FirstName.toLowerCase().includes(searchTerm)) ||
          (employee.employee_LastName && employee.employee_LastName.toLowerCase().includes(searchTerm)) ||
          (employee.employee_Department && employee.employee_Department.toLowerCase().includes(searchTerm)) ||
          (employee.employeeID && employee.employeeID.toString().includes(searchTerm))
        );
      });
    };

    // Filter employees by department
    this.filterByDepartment = function(employees, department) {
      if (!department || department === 'All') {
        return employees;
      }

      return employees.filter(function(employee) {
        return employee.employee_Department === department;
      });
    };

    // Filter employees by status
    this.filterByStatus = function(employees, status) {
      if (!status || status === 'All') {
        return employees;
      }

      const isActive = status === 'Active';
      return employees.filter(function(employee) {
        return this.isEmployeeActive(employee) === isActive;
      }.bind(this));
    };

    // Sort employees by field
    this.sortEmployees = function(employees, sortField, sortDirection) {
      if (!sortField) return employees;

      return employees.sort(function(a, b) {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
        if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    };

    // Export employees to CSV
    this.exportToCSV = function(employees) {
      if (!employees || employees.length === 0) {
        throw new Error('No data to export');
      }

      const headers = [
        'Employee ID',
        'First Name',
        'Last Name',
        'Date of Birth',
        'Date of Joining',
        'Department',
        'Salary',
        'Status',
        'Created On',
        'Created By',
        'Modified On',
        'Modified By'
      ];

      const csvContent = [
        headers.join(','),
        ...employees.map(emp => [
          emp.employeeID,
          `"${emp.employee_FirstName || ''}"`,
          `"${emp.employee_LastName || ''}"`,
          this.formatDateForDisplay(emp.employee_DateofBirth),
          this.formatDateForDisplay(emp.employee_DateofJoining),
          `"${emp.employee_Department || ''}"`,
          emp.employee_Salary || 0,
          this.getEmployeeStatusText(emp),
          this.formatDateForDisplay(emp.employee_CreatedOn),
          emp.employee_CreatedBy || '',
          this.formatDateForDisplay(emp.employee_ModifiedOn),
          emp.employee_ModifiedBy || ''
        ].join(','))
      ].join('\n');

      return csvContent;
    };

    // Download CSV file
    this.downloadCSV = function(csvContent, filename) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename || 'employees.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    // Get employee statistics
    this.getEmployeeStatistics = function(employees) {
      if (!employees || employees.length === 0) {
        return {
          total: 0,
          active: 0,
          inactive: 0,
          departments: {},
          averageSalary: 0,
          totalSalary: 0
        };
      }

      const stats = {
        total: employees.length,
        active: 0,
        inactive: 0,
        departments: {},
        averageSalary: 0,
        totalSalary: 0
      };

      let totalSalary = 0;

      employees.forEach(function(employee) {
        // Count active/inactive
        if (this.isEmployeeActive(employee)) {
          stats.active++;
        } else {
          stats.inactive++;
        }

        // Count by department
        const dept = employee.employee_Department || 'Unknown';
        stats.departments[dept] = (stats.departments[dept] || 0) + 1;

        // Calculate salary totals
        const salary = parseFloat(employee.employee_Salary) || 0;
        totalSalary += salary;
      }.bind(this));

      stats.totalSalary = totalSalary;
      stats.averageSalary = stats.total > 0 ? totalSalary / stats.total : 0;

      return stats;
    };
  });