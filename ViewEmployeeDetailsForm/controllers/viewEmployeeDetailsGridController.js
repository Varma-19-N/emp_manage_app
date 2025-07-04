// Controller for handling employee details view in a grid format
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
    $scope.gridOptions = null;
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
      animateRows: true
    };

    // Populate the grid with employee data
    function initializeGridWithData(employeeData) {
      // Assign the employee data to grid rows
      $scope.gridOptions.rowData = employeeData;

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
          $scope.$apply(); // Update the view to show the error message
        });
    }

    // Delay data fetching slightly to ensure the view is fully loaded
    $timeout(() => {
      fetchDataAndRenderGrid();
    }, 200);
  });
