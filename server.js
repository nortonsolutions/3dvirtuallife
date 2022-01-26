/**
 * Norton 2021 - CourseApp App
 */

'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
// const fs          = require('fs');

const apiRoutes                = require('./routes/api.js');
const hbsHelpers               = require('./public/handlebarsHelpers.js')
const hbs                      = require('express-hbs');
const mongoose                 = require('mongoose');

// For unit and functional testing with Chai later:
// var expect            = require('chai').expect;
// var fccTestingRoutes  = require('./routes/fcctesting.js');
const runner                   = require('./test-runner');
const database                 = require('./database.js');
const socket                   = require('socket.io');

const app = express();

app.games = {};  // i.e. catalog of 'namespaces' (games)
app.use('/', express.static(process.cwd() + '/'));
app.use('/cdn', express.static(process.cwd() + '/cdn'));
app.use('/assets', express.static(process.cwd() + '/assets'));
app.use('/scene', express.static(process.cwd() + '/views/scene'));
  
hbsHelpers(hbs);

database(mongoose, (db) => {

  app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
  }));
    
  app.set("view engine", "hbs");
  app.set('views', __dirname + '/views');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  //For FCC testing purposes
  // fccTestingRoutes(app);
    
  apiRoutes(app, db);
    
  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
    
  //Start our server and tests!
  var server = app.listen(process.env.PORT || 3001, function () {
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

  // Socket setup
  var io = socket(server);

  /**  
   * Allow regex for multiple namespaces in future socket.io release:
   * 
   * io.of(/.+/).on('connection', (socket) => {
   * 
   * For now, I'll use just one universal namespace (i.e. one game per server).
   *   -Dave 
   */
  io.on('connection', (socket) => {
    console.log(`Made socket connection - ${socket.id}`);

    // Default namespace = "/" (equivalent to io.sockets)
    app.games[socket.nsp.name] = {};
    var connectionId = socket.id;
    var playerName = null;

    // CHAT messages (data: { message: ...})
    socket.on('chat', (data) => {
      // io.sockets.emit('chat', {...data, playerName});
      socket.nsp.emit('chat', {...data, playerName});
    });

    /**
     * The 'room' corresponds to a particular level in the game,
     * with its own layout and such.  The idea here is that when
     * live changes are happening in the level such as entity movement,
     * these updates are broadcast only to others in the same room.
     */
    socket.on('joinroom', (data) => {
      Object.keys(socket.rooms).forEach(key => {
        if (socket.key != socket.id) socket.leave(key);
      });
      socket.join(socket.nsp.name + data.level);
      socket.nsp.emit('chat', { message: `entered ${data.level}`, playerName});
    });

    socket.on('updateEntityPosition', (data) => {
      // Which room to notify?
      Object.keys(socket.rooms).forEach(room => {
        if (socket.key != socket.id) socket.to(room).emit(data);
      });
    });
    
    socket.on('gameProps', (data) => {
      app.games[socket.nsp.name] = data; // save for join-game lookups
      socket.nsp.emit('gameProps', data); // can I only broadcast.emit to others in the nsp?
    });

    socket.on('introduce', (data) => {
      playerName = data.name; 
    });

    socket.on('disconnect', (reason) => {

      if (Object.keys(socket.nsp.sockets).length == 0) {
        delete app.games[socket.nsp.name];
      }
      console.log(`Disconnecting ${socket.id}`)
    });
  })

})

module.exports = app; //for testing
