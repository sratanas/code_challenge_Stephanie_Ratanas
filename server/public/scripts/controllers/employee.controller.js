myApp.controller('EmployeeController', ['UserService', 'EmployeeService', '$routeParams', function(UserService, EmployeeService, $routeParams) {
    console.log('EmployeeController created');
    var self = this;
    self.userService = UserService;
    self.EmployeeService = EmployeeService;

    self.getAssignedShifts = EmployeeService.getAssignedShifts;
    self.getCoworkers = EmployeeService.getCoworkers;
    self.getManagers = EmployeeService.getManagers;
    self.assignedShiftArray= EmployeeService.assignedShiftArray;

    EmployeeService.getManagers();
    EmployeeService.getAssignedShifts($routeParams);
  

  }]);
  