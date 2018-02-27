myApp.service('EmployeeService', ['$http', '$location', function ($http, $location) {
    console.log('EmployeeService Loaded');
    var self = this;
    
    self.getManagers = function () {
        $http({
          method: 'GET',
          url: '/api/employee/getManagers'
        }).then(function (response) {
          self.managerArray = response.data;

        })
      }

    self.getAssignedShifts = function (employeeId) {
        $http({
          method: 'GET',
          url: '/api/employee/getAssignedShifts',
          params: employeeId
        }).then(function (response) {
          self.assignedShiftArray = response.data;
            self.hoursArray = []
          for (var i = 0; i < self.assignedShiftArray.length; i++){
            console.log('value of end time',self.assignedShiftArray[i].end_time.valueOf());
            var date1 = new Date(self.assignedShiftArray[i].end_time);
            var date2 = new Date(self.assignedShiftArray[i].start_time);
            var difference = Math.abs(date1.getTime() - date2.getTime());

            self.hourDifference = difference  / 1000 / 3600;
            // var hours = self.hourDifference[]
            var hours = self.hoursArray.push(self.hourDifference)
            function array(arr){
                var sum = 0;
                for (var i = 0; i< arr.length; i++){
                 self.sumArray = sum += arr[i];
                }
                console.log(self.sumArray);
              }
              array(self.hoursArray);
            
            console.log('hoursArray', self.hoursArray);

        }

            
        })
        
      }
  

      
    self.getCoworkers = function (shiftId) {

        $http({
          method: 'GET',
          url: '/api/employee/getCoworkers',
          params: {shiftId}
        }).then(function (response) {
            console.log('response from getCoworkers', response);
          self.coworkersArray = response.data;
          


        })
      }



  }]);
  