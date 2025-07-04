// Model for defining the structure of the employee details grid
angular.module("viewEmployeeDetailsFormModule")
  .factory("viewEmployeeDetailsModel", function () {
    return {
      // Returns the column definitions for the employee details grid
      getGridColumnDefinitions: function () {
        return [
          { headerName: "ID", field: "employeeID", minWidth: 120 }, // Unique identifier for each employee
          { headerName: "First Name", field: "employee_FirstName", minWidth: 150 }, // Employee's first name
          { headerName: "Last Name", field: "employee_LastName", minWidth: 150 }, // Employee's last name
          { headerName: "Date of Birth", field: "employee_DateofBirth", minWidth: 140 }, // Birth date of the employee
          { headerName: "Date of Join", field: "employee_DateofJoining", minWidth: 140 }, // When the employee joined the company
          { headerName: "Department", field: "employee_Department", minWidth: 150 }, // Department where the employee works
          { headerName: "Salary", field: "employee_Salary", minWidth: 120 }, // Salary information
          { headerName: "Inactive", field: "employee_InActive", minWidth: 120 }, // Status indicating if the employee is inactive
          { headerName: "Created On", field: "employee_CreatedOn", minWidth: 140 }, // When the record was created
          { headerName: "Created By", field: "employee_CreatedBy", minWidth: 130 }, // Who created the record
          { headerName: "Modified On", field: "employee_ModifiedOn", minWidth: 140 }, // Last modification date of the record
          { headerName: "Modified By", field: "employee_ModifiedBy", minWidth: 130 } // Who last modified the record
        ];
      }
    };
  });
