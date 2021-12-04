/**
 * Norton 2021 - CourseApp App
 */

'use strict';

var express     = require('express');
var fs          = require('fs');

var apiRoutes                = require('./routes/api.js');
var hbsHelpers               = require('./public/handlebarsHelpers.js')
var hbs                      = require('express-hbs');

// For unit and functional testing with Chai later:
// var expect            = require('chai').expect;
// var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

const app = express();

app.use('/', express.static(process.cwd() + '/'));
app.use('/cdn', express.static(process.cwd() + '/cdn'));
app.use('/assets', express.static(process.cwd() + '/assets'));
app.use('/viewScripts', express.static(process.cwd() + '/views/viewScripts'));
  
hbsHelpers(hbs);

app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
  
app.set("view engine", "hbs");
app.set('views', __dirname + '/views');
  
//For FCC testing purposes
// fccTestingRoutes(app);
  
apiRoutes(app);
  
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});
  
//Start our server and tests!
app.listen(process.env.PORT || 3001, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing
