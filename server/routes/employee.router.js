const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/getManagers', function (req, res) {
          pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
          console.log('error', errorConnectingToDatabase);
          res.sendStatus(500);
        } else {
          client.query(`SELECT * FROM users WHERE role='manager';`, function (errorMakingDatabaseQuery, result) {
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
  
  });

router.get('/getAssignedShifts', function (req, res) {
      pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
          console.log('error', errorConnectingToDatabase);
          res.sendStatus(500);
        } else {
          client.query(`SELECT shifts.id, users.id as emp_id, users.name, shifts.manager_id, shifts.start_time, shifts.end_time
          FROM shifts
          JOIN employee_shifts ON shifts.id = employee_shifts.shift_id
          JOIN users ON users.id = employee_shifts.employee_id
          WHERE users.id = $1;`,[req.query.id], function (errorMakingDatabaseQuery, result) {
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
  
  });

  router.get('/getCoworkers', function (req, res) {    
      pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
          console.log('error', errorConnectingToDatabase);
          res.sendStatus(500);
        } else {
          client.query(`SELECT users.name, employee_shifts.shift_id
          FROM users
          JOIN employee_shifts ON users.id = employee_shifts.employee_id
          WHERE employee_shifts.shift_id = $1;`,[req.query.shiftId], function (errorMakingDatabaseQuery, result) {
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
  });



module.exports = router;


