const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const passport = require('./strategies/sql.localstrategy');
var sessionConfig = require('./modules/session.config');
var moment = require('moment');


// Route includes
const userRouter = require('./routes/user.router');
const employeeRouter = require('./routes/employee.router');


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/employee', employeeRouter)

// Serve static files
app.use(express.static('server/public'));

const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
