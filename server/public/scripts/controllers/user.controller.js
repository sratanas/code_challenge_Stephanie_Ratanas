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

  

  UserService.getEmployees();
  UserService.getShifts()

}]);
