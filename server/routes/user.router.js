const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();


// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.sendStatus(403);
  }
});


router.post('/register', (req, res, next) => {
  const name = req.body.name;
  const password = encryptLib.encryptPassword(req.body.password);

  var saveUser = {
    username: req.body.username,
    name: req.body.name,
    password: encryptLib.encryptPassword(req.body.password),
    email: req.body.email,
    phone: req.body.phone
  };
  pool.query('INSERT INTO users (username, password, name, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [saveUser.username, saveUser.password, saveUser.name, saveUser.email, saveUser.phone], (err, result) => {
      if (err) {
        console.log("Error inserting data: ", err);
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    });
});


router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

//For getting employees
router.get('/employees', function (req, res) {
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
    console.log('not logged in');
    res.send(false);
  }

});


//Creating new shift
router.post('/newShift', function (req, res) {
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
    console.log('not logged in');
    res.send(false);
  }

});


//Assigning a shift
router.post('/assignShift', function (req, res) {
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
  if (req.isAuthenticated()) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
      if (errorConnectingToDatabase) {
        console.log('error', errorConnectingToDatabase);
        res.sendStatus(500);
      } else {
        client.query(`SELECT shifts.id, users.name, shifts.manager_id, shifts.start_time, shifts.end_time
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
  console.log('not logged in');
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
  console.log('not logged in');
  res.send(false);
}});

module.exports = router;


