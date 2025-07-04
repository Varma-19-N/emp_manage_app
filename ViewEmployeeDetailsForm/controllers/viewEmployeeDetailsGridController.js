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

    // Holds any error message that comes back from the server
    $scope.errorMessageFromServer = "";
    $scope.successMessage = "";
    $scope.gridOptions = null;
    $scope.selectedEmployeeRecord = null;
    $scope.showAddModal = false;
    $scope.showUpdateModal = false;
    $scope.showDeleteModal = false;
    $scope.loading = true;
    
    // Form data for add/update operations
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
      }
    };

    // Initialize empty form
    function initializeEmployeeForm() {
      $scope.employeeForm = {
        employeeID: '',
        employee_FirstName: '',
        employee_LastName: '',
        employee_DateofBirth: '',
        employee_DateofJoining: '',
        employee_Department: '',
        employee_Salary: '',
        employee_InActive: false
      };
    }

    // Populate the grid with employee data
    function initializeGridWithData(employeeData) {
      // Assign the employee data to grid rows
      $scope.gridOptions.rowData = employeeData;
      $scope.loading = false;

      // If grid isn't initialized, create it
      if (!gridInstance) {
        gridInstance = agGrid.createGrid(gridContainer, $scope.gridOptions);
      }
      // Otherwise, just update the row data
      else if ($scope.gridOptions.api) {
        $scope.gridOptions.api.setRowData(employeeData);
      }

      // Auto-size columns after a small delay to ensure everything is rendered
      $timeout(() => {
        const allColumns = $scope.gridOptions.columnDefs.map(col => col.field);
        if ($scope.gridOptions.api) {
          $scope.gridOptions.api.autoSizeColumns(allColumns, false);
        }
      }, 100);
    }

    // Fetch employee data from backend and initialize the grid
    function fetchDataAndRenderGrid() {
      $scope.loading = true;
      viewEmployeeDataFetchService
        .fetchAllEmployeeDetailsFromBackend()
        .then(function (data) {
          console.log("Employee data received:", data);
          initializeGridWithData(data);
        })
        .catch(function (error) {
          console.error("Error fetching data:", error);
          $scope.errorMessageFromServer =
            "Failed to load employee data. Please try again.";
          $scope.loading = false;
          $scope.$apply();
        });
    }

    // Clear messages
    function clearMessages() {
      $scope.errorMessageFromServer = "";
      $scope.successMessage = "";
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
      if ($scope.employeeForm.employee_DateofBirth) {
        $scope.employeeForm.employee_DateofBirth = new Date($scope.employeeForm.employee_DateofBirth).toISOString().split('T')[0];
      }
      if ($scope.employeeForm.employee_DateofJoining) {
        $scope.employeeForm.employee_DateofJoining = new Date($scope.employeeForm.employee_DateofJoining).toISOString().split('T')[0];
      }
      
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

    // Save new employee
    $scope.saveNewEmployee = function() {
      if (!$scope.validateEmployeeForm()) {
        return;
      }

      const employeeData = angular.copy($scope.employeeForm);
      employeeData.employee_CreatedBy = 'Current User'; // Replace with actual user
      employeeData.employee_CreatedOn = new Date().toISOString();

      viewEmployeeDataFetchService
        .addEmployeeRecord(employeeData)
        .then(function(response) {
          $scope.successMessage = "Employee added successfully!";
          $scope.showAddModal = false;
          fetchDataAndRenderGrid(); // Refresh grid
        })
        .catch(function(error) {
          $scope.errorMessageFromServer = "Failed to add employee. Please try again.";
          console.error("Add employee error:", error);
        });
    };

    // Update existing employee
    $scope.updateEmployee = function() {
      if (!$scope.validateEmployeeForm()) {
        return;
      }

      const employeeData = angular.copy($scope.employeeForm);
      employeeData.employee_ModifiedBy = 'Current User'; // Replace with actual user
      employeeData.employee_ModifiedOn = new Date().toISOString();

      viewEmployeeDataFetchService
        .updateEmployeeRecord(employeeData)
        .then(function(response) {
          $scope.successMessage = "Employee updated successfully!";
          $scope.showUpdateModal = false;
          $scope.selectedEmployeeRecord = null;
          fetchDataAndRenderGrid(); // Refresh grid
        })
        .catch(function(error) {
          $scope.errorMessageFromServer = "Failed to update employee. Please try again.";
          console.error("Update employee error:", error);
        });
    };

    // Confirm delete employee
    $scope.confirmDeleteEmployee = function() {
      viewEmployeeDataFetchService
        .deleteEmployeeRecord($scope.selectedEmployeeRecord.employeeID)
        .then(function(response) {
          $scope.successMessage = "Employee deleted successfully!";
          $scope.showDeleteModal = false;
          $scope.selectedEmployeeRecord = null;
          fetchDataAndRenderGrid(); // Refresh grid
        })
        .catch(function(error) {
          $scope.errorMessageFromServer = "Failed to delete employee. Please try again.";
          console.error("Delete employee error:", error);
        });
    };

    // Validate employee form
    $scope.validateEmployeeForm = function() {
      if (!$scope.employeeForm.employee_FirstName || !$scope.employeeForm.employee_FirstName.trim()) {
        $scope.errorMessageFromServer = "First Name is required.";
        return false;
      }
      if (!$scope.employeeForm.employee_LastName || !$scope.employeeForm.employee_LastName.trim()) {
        $scope.errorMessageFromServer = "Last Name is required.";
        return false;
      }
      if (!$scope.employeeForm.employee_DateofBirth) {
        $scope.errorMessageFromServer = "Date of Birth is required.";
        return false;
      }
      if (!$scope.employeeForm.employee_DateofJoining) {
        $scope.errorMessageFromServer = "Date of Joining is required.";
        return false;
      }
      if (!$scope.employeeForm.employee_Department || !$scope.employeeForm.employee_Department.trim()) {
        $scope.errorMessageFromServer = "Department is required.";
        return false;
      }
      if (!$scope.employeeForm.employee_Salary || $scope.employeeForm.employee_Salary <= 0) {
        $scope.errorMessageFromServer = "Valid salary is required.";
        return false;
      }
      return true;
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

    // Initialize form on load
    initializeEmployeeForm();

    // Delay data fetching slightly to ensure the view is fully loaded
    $timeout(() => {
      fetchDataAndRenderGrid();
    }, 200);
  });