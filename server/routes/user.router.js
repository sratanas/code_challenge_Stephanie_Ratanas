const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();


// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    res.send(req.user);
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const name = req.body.name;
  const password = encryptLib.encryptPassword(req.body.password);

  var saveUser = {
    name: req.body.name,
    password: encryptLib.encryptPassword(req.body.password)
  };
  console.log('new user:', saveUser);
  pool.query('INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id',
    [saveUser.name, saveUser.password], (err, result) => {
      if (err) {
        console.log("Error inserting data: ", err);
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.get('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

//For getting employees
router.get('/employees', function (req, res) {
  console.log('in getEmployees');
  if (req.isAuthenticated()) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
      if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
      } else {
        client.query(`SELECT * FROM users WHERE users.role='employee'`, function (errorMakingDatabaseQuery, result) {
          done();
          if (errorMakingDatabaseQuery) {
            console.log('error', errorMakingDatabaseQuery);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }

});


//Creating new shift
router.post('/newShift', function (req, res) {

  console.log('in newShift route');
  pool.connect(function (errorConnectingToDatabase, client, done) {
    if (errorConnectingToDatabase) {
      console.log('error', errorConnectingToDatabase);
      res.sendStatus(500);

    } else {
      client.query(`INSERT INTO shifts ("manager_id", "start_time", "end_time", "created_at")
          VALUES ($1, $2, $3, $4);`, [req.user.id, req.body.start_time, req.body.end_time, new Date()],
        function (errorMakingDatabaseQuery, result) {
          done();
          if (errorMakingDatabaseQuery) {
            console.log('error', errorMakingDatabaseQuery);
            res.sendStatus(500);

          } else {
            res.sendStatus(201);
          }
        })
    }
  })
});


//For getting all shifts
router.get('/getShifts', function (req, res) {
  console.log('in getShifts');
  if (req.isAuthenticated()) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
      if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
      } else {
        client.query(`SELECT * FROM shifts ORDER BY start_time;`, function (errorMakingDatabaseQuery, result) {
          done();
          if (errorMakingDatabaseQuery) {
            console.log('error', errorMakingDatabaseQuery);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }

});


//Assigning a shift
router.post('/assignShift', function (req, res) {

  console.log('in assignShift route');
  pool.connect(function (errorConnectingToDatabase, client, done) {
    if (errorConnectingToDatabase) {
      console.log('error', errorConnectingToDatabase);
      res.sendStatus(500);

    } else {
      client.query(`INSERT INTO employee_shifts ("employee_id", "shift_id") VALUES ($1, $2);`, [req.body.employee_id, req.body.shift_id],
        function (errorMakingDatabaseQuery, result) {
          done();
          if (errorMakingDatabaseQuery) {
            console.log('error', errorMakingDatabaseQuery);
            res.sendStatus(500);

          } else {
            res.sendStatus(201);
          }
        })
    }
  })
});


//For getting all shifts
router.get('/getRangeWithShifts', function (req, res) {
  console.log('in getRangeWithShifts');
  console.log('req.body is', req.query);
  
  if (req.isAuthenticated()) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
      if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
      } else {
        client.query(`SELECT shifts.employee_id, shifts.id, users.name, shifts.manager_id, shifts.start_time, shifts.end_time
        FROM shifts
        JOIN employee_shifts ON shifts.id = employee_shifts.shift_id
        JOIN users ON users.id = employee_shifts.employee_id
        WHERE start_time BETWEEN $1 AND $2;
        `,[req.query.endDate, req.query.startDate], function (errorMakingDatabaseQuery, result) {
          done();
          if (errorMakingDatabaseQuery) {
            console.log('error', errorMakingDatabaseQuery);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }

});


router.put('/editShift', function (req, res) {
  console.log('req.body.id is', req.body.id);
  
  if(req.isAuthenticated()) {  
  pool.connect(function (errorConnectingToDatabase, client, done) {
      if (errorConnectingToDatabase) {
          console.log('error', errorConnectingToDatabase);
          res.sendStatus(500);

      } else {
          client.query(`UPDATE shifts set start_time = $1, end_time = $2
          WHERE id = $1;`,[req.body.start_time, req.body.end_time, req.body.id],
              function (errorMakingDatabaseQuery, result) {
                  done();
                  if (errorMakingDatabaseQuery) {
                      console.log('error', errorMakingDatabaseQuery);
                      res.sendStatus(500);

                  } else {
                      res.sendStatus(200);
                  }
              })
      }
  })
} else {
  // failure best handled on the server. do redirect here.
  console.log('not logged in');
  // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
  res.send(false);
}});


router.put('/reassignShift', function (req, res) {
  console.log('req.body.id is', req.body.id);
  
  if(req.isAuthenticated()) {  
  pool.connect(function (errorConnectingToDatabase, client, done) {
      if (errorConnectingToDatabase) {
          console.log('error', errorConnectingToDatabase);
          res.sendStatus(500);

      } else {
          client.query(`UPDATE employee_shifts set employee_id = $1
          WHERE shift_id = $2;`,[req.body.employee_id, req.body.id],
              function (errorMakingDatabaseQuery, result) {
                  done();
                  if (errorMakingDatabaseQuery) {
                      console.log('error', errorMakingDatabaseQuery);
                      res.sendStatus(500);

                  } else {
                      res.sendStatus(200);
                  }
              })
      }
  })
} else {
  // failure best handled on the server. do redirect here.
  console.log('not logged in');
  // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
  res.send(false);
}});

module.exports = router;


