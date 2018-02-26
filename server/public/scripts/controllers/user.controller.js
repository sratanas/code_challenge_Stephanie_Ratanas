myApp.controller('UserController', ['UserService', function(UserService) {
  console.log('UserController created');
  var self = this;
  self.userService = UserService;
  self.userObject = UserService.userObject;

  self.getEmployees = UserService.getEmployees;
  self.employeeArray = UserService.employeeArray;

  self.getShifts = UserService.getShifts;
  self.assignShift = UserService.assignShift;

  self.addShift = UserService.addShift;
  self.newShift = UserService.newShift;

  self.getRange = UserService.getRange;
  self.dateArray = UserService.dateArray;

  self.getAssignedShifts = UserService.getAssignedShifts
  self.assignedShifts = UserService.assignedShifts;

  self.getRangeWithShifts = UserService.getRangeWithShifts;
  self.selectedRangeShifts = UserService.selectedRangeShifts;

  self.editShift = UserService.editShift;
  self.reassignShift = UserService.reassignShift;
  

  UserService.getEmployees();
  UserService.getShifts();
  // UserService.getAssignedShifts();
 

}]);
