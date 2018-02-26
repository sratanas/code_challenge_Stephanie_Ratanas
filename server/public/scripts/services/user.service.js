myApp.service('UserService', ['$http', '$location', function ($http, $location) {
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};
  self.employeeShiftArray =[]
  self.selectedRangeShifts = [];

  self.getuser = function () {
    console.log('UserService -- getuser');
    $http.get('/api/user').then(function (response) {
      if (response.data.username) {
        // user has a curret session on the server
        self.userObject.userName = response.data.username;
        console.log('UserService -- getuser -- User Data: ', self.userObject.userName);
      } else {
        console.log('UserService -- getuser -- failure');
        // user has no session, bounce them back to the login page
        $location.path("/home");
      }
    }, function (response) {
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  },

    self.logout = function () {
      console.log('UserService -- logout');
      $http.get('/api/user/logout').then(function (response) {
        console.log('UserService -- logout -- logged out');
        $location.path("/home");
      });
    }

  //For getting all employees
  self.getEmployees = function () {
    $http({
      method: 'GET',
      url: '/api/user/employees'
    }).then(function (response) {
      console.log('response', response);
      self.employeeArray = response.data

    });
  };

  //For creating a shift
  self.addShift = function (newShift) {
    $http({
      method: 'POST',
      url: '/api/user/newShift',
      data: newShift
    }).then(function (response) {
      console.log('response', response);
      alert("You added a shift!")
      newShift.start_time = '';
      newShift.end_time = '';
      self.getShifts();

    });
  };

  self.getShifts = function () {
    $http({
      method: 'GET',
      url: '/api/user/getShifts',
    }).then(function (response) {
      self.shiftArray = response.data;
      // moment([...self.shiftArray]).format('')
      self.shiftArray.start_time
    })
  }

  self.assignShift = function (assignedShift) {
    $http({
      method: 'POST',
      url: 'api/user/assignShift',
      data: assignedShift
    }).then(function (response) {
      alert('You assigned a shift!')
      assignedShift.employee_id = '';
      assignedShift.shift_id = '';
    })
  }



  self.getRange = function (startParam, endParam){
    var newend = endParam.setDate(endParam.getDate()+1);
    var end = new Date(newend);
    self.dateArray = []
      while(startParam < end){
        var newDate = startParam.setDate(startParam.getDate() + 1);
        startParam = new Date(newDate);
        console.log(new Date(startParam));
        self.dateArray.push(new Date(startParam))
        console.log('dateArray', self.dateArray); 
      } 

  }

//Experiment to add shift array
  self.getRangeWithShifts = function (endDate, startDate){
    $http({
      method: 'GET',
      url: '/api/user/getRangeWithShifts',
      params: {
        endDate,
        startDate
      }
    }).then(function (response) {
      console.log('response from getRange with Shifts', response);
      
      self.selectedRangeShifts = response.data;
    })

  }


  self.getAssignedShifts = function () {
    $http({
      method: 'GET',
      url: '/api/user/getAssignedShifts',
    }).then(function (response) {
      self.assignedShifts = response.data;
    })
  }

  //WORKING ON THIS TO COMPARE DATES AND PUSH INTO CARDS
  // self.sortAssignedShifts = function () {
  //   console.log('sort Assigned Shifts Run');
  //   console.log('self.assignedShfits', self.assignedShifts);
    
  //   self.byDateArray = []
  //   for (var i = 0; i < self.assignedShifts.length; i++) {
  //     shift = self.assignedShifts[i];
  //     console.log(moment(shift).format("MMM Do YY"));
      
  //     for (var j = 0; j < self.dateArray.length; j++) {
  //       dateRangeDate = self.dateArray[j];
  //     console.log(moment(dateRangeDate).format("MMM Do YY"));


  //       if (moment(shift).format("MMM Do YY") === moment(dateRangeDate).format("MMM Do YY")) {
  //         self.byDateArray.push(shift)
  //         console.log('byDateArray', self.byDateArray);
          
  //       }
  //     }
  //   };
  // }

}]);
