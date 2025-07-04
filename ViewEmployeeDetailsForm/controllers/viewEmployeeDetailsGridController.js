// Controller for handling employee details view in a grid format with CRUD operations
angular
  .module("viewEmployeeDetailsFormModule")
  .controller("ViewEmployeeDetailsGridController", function (
    $scope,
    $timeout,
    viewEmployeeDataFetchService,
    viewEmployeeDetailsModel
  ) {
    console.log("ViewEmployeeDetailsGridController initialized");

    // Scope variables
    $scope.errorMessageFromServer = "";
    $scope.successMessage = "";
    $scope.gridOptions = null;
    $scope.selectedEmployeeRecord = null;
    $scope.showAddModal = false;
    $scope.showUpdateModal = false;
    $scope.showDeleteModal = false;
    $scope.loading = true;
    $scope.processing = false;
    
    // Form data for add/update operations - matching database structure
    $scope.employeeForm = {};
    
    let gridInstance = null;

    // Grab the grid div from the DOM
    const gridContainer = document.querySelector("#employeeGrid");

    // Set up the grid options using the model's column definitions
    $scope.gridOptions = {
      columnDefs: viewEmployeeDetailsModel.getGridColumnDefinitions(),
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        flex: 1
      },
      rowData: [],
      pagination: true,
      paginationPageSize: 10,
      animateRows: true,
      rowSelection: 'single',
      onSelectionChanged: function() {
        const selectedRows = $scope.gridOptions.api.getSelectedRows();
        $scope.selectedEmployeeRecord = selectedRows.length > 0 ? selectedRows[0] : null;
        $scope.$apply();
        console.log("Selected employee:", $scope.selectedEmployeeRecord);
      }
    };

    // Initialize empty form matching database structure
    function initializeEmployeeForm() {
      $scope.employeeForm = {
        employeeID: null,
        employee_FirstName: '',
        employee_LastName: '',
        employee_DateofBirth: '',
        employee_DateofJoining: '',
        employee_Department: '',
        employee_Salary: 0,
        employee_InActive: false
      };
    }

    // Populate the grid with employee data
    function initializeGridWithData(employeeData) {
      // Process data to handle boolean conversion for InActive field
      const processedData = employeeData.map(function(employee) {
        return {
          ...employee,
          employee_InActive: employee.employee_InActive === 1 || employee.employee_InActive === true
        };
      });

      $scope.gridOptions.rowData = processedData;
      $scope.loading = false;

      // If grid isn't initialized, create it
      if (!gridInstance) {
        gridInstance = agGrid.createGrid(gridContainer, $scope.gridOptions);
      }
      // Otherwise, just update the row data
      else if ($scope.gridOptions.api) {
        $scope.gridOptions.api.setRowData(processedData);
      }

      // Auto-size columns after a small delay to ensure everything is rendered
      $timeout(() => {
        if ($scope.gridOptions.api) {
          $scope.gridOptions.api.sizeColumnsToFit();
        }
      }, 100);
    }

    // Fetch employee data from backend and initialize the grid
    function fetchDataAndRenderGrid() {
      $scope.loading = true;
      clearMessages();
      
      viewEmployeeDataFetchService
        .fetchAllEmployeeDetailsFromBackend()
        .then(function (data) {
          console.log("Employee data received:", data);
          initializeGridWithData(data);
        })
        .catch(function (error) {
          console.error("Error fetching data:", error);
          $scope.errorMessageFromServer = error.message || "Failed to load employee data. Please try again.";
          $scope.loading = false;
          $scope.$apply();
        });
    }

    // Clear messages
    function clearMessages() {
      $scope.errorMessageFromServer = "";
      $scope.successMessage = "";
    }

    // Format date for input fields (YYYY-MM-DD)
    function formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    }

    // Add new employee record
    $scope.addNewEmployeeRecord = function() {
      clearMessages();
      initializeEmployeeForm();
      $scope.showAddModal = true;
    };

    // Update selected employee record
    $scope.updateSelectedEmployeeRecord = function() {
      if (!$scope.selectedEmployeeRecord) {
        $scope.errorMessageFromServer = "Please select an employee record to update.";
        return;
      }
      
      clearMessages();
      // Copy selected record to form
      $scope.employeeForm = angular.copy($scope.selectedEmployeeRecord);
      
      // Format dates for input fields
      $scope.employeeForm.employee_DateofBirth = formatDateForInput($scope.employeeForm.employee_DateofBirth);
      $scope.employeeForm.employee_DateofJoining = formatDateForInput($scope.employeeForm.employee_DateofJoining);
      
      // Ensure boolean conversion for InActive field
      $scope.employeeForm.employee_InActive = $scope.employeeForm.employee_InActive === 1 || $scope.employeeForm.employee_InActive === true;
      
      $scope.showUpdateModal = true;
    };

    // Delete selected employee record
    $scope.deleteSelectedEmployeeRecord = function() {
      if (!$scope.selectedEmployeeRecord) {
        $scope.errorMessageFromServer = "Please select an employee record to delete.";
        return;
      }
      
      clearMessages();
      $scope.showDeleteModal = true;
    };

    // Validate employee form
    $scope.validateEmployeeForm = function() {
      clearMessages();
      
      const validation = viewEmployeeDataFetchService.validateEmployeeData($scope.employeeForm);
      
      if (!validation.isValid) {
        $scope.errorMessageFromServer = validation.errors.join(', ');
        return false;
      }
      
      return true;
    };

    // Save new employee
    $scope.saveNewEmployee = function() {
      if (!$scope.validateEmployeeForm() || $scope.processing) {
        return;
      }

      $scope.processing = true;
      const employeeData = angular.copy($scope.employeeForm);

      viewEmployeeDataFetchService
        .addEmployeeRecord(employeeData)
        .then(function(response) {
          $scope.successMessage = "Employee added successfully!";
          $scope.showAddModal = false;
          $scope.processing = false;
          fetchDataAndRenderGrid(); // Refresh grid
        })
        .catch(function(error) {
          $scope.errorMessageFromServer = error.message || "Failed to add employee. Please try again.";
          $scope.processing = false;
          console.error("Add employee error:", error);
        });
    };

    // Update existing employee
    $scope.updateEmployee = function() {
      if (!$scope.validateEmployeeForm() || $scope.processing) {
        return;
      }

      $scope.processing = true;
      const employeeData = angular.copy($scope.employeeForm);

      viewEmployeeDataFetchService
        .updateEmployeeRecord(employeeData)
        .then(function(response) {
          $scope.successMessage = "Employee updated successfully!";
          $scope.showUpdateModal = false;
          $scope.selectedEmployeeRecord = null;
          $scope.processing = false;
          fetchDataAndRenderGrid(); // Refresh grid
        })
        .catch(function(error) {
          $scope.errorMessageFromServer = error.message || "Failed to update employee. Please try again.";
          $scope.processing = false;
          console.error("Update employee error:", error);
        });
    };

    // Confirm delete employee
    $scope.confirmDeleteEmployee = function() {
      if ($scope.processing) return;
      
      $scope.processing = true;
      
      viewEmployeeDataFetchService
        .deleteEmployeeRecord($scope.selectedEmployeeRecord.employeeID)
        .then(function(response) {
          $scope.successMessage = "Employee deleted successfully!";
          $scope.showDeleteModal = false;
          $scope.selectedEmployeeRecord = null;
          $scope.processing = false;
          fetchDataAndRenderGrid(); // Refresh grid
        })
        .catch(function(error) {
          $scope.errorMessageFromServer = error.message || "Failed to delete employee. Please try again.";
          $scope.processing = false;
          console.error("Delete employee error:", error);
        });
    };

    // Close modals
    $scope.closeAddModal = function() {
      $scope.showAddModal = false;
      clearMessages();
    };

    $scope.closeUpdateModal = function() {
      $scope.showUpdateModal = false;
      clearMessages();
    };

    $scope.closeDeleteModal = function() {
      $scope.showDeleteModal = false;
      clearMessages();
    };

    // Auto-hide success messages after 5 seconds
    $scope.$watch('successMessage', function(newVal) {
      if (newVal) {
        $timeout(function() {
          $scope.successMessage = "";
        }, 5000);
      }
    });

    // Initialize form on load
    initializeEmployeeForm();

    // Delay data fetching slightly to ensure the view is fully loaded
    $timeout(() => {
      fetchDataAndRenderGrid();
    }, 200);
  });