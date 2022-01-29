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

// TODO: Thread safety may become a concern for app.rooms

app.games = {}; // catalog of 'namespaces' (games)
app.rooms = {}; // current room membership; app.rooms[nsp][room] is an array of [socket.id,data.heroTemplate,firstInRoom]
app.layouts = {}; // layouts for each room/level; app.layouts[nsp][room] = {layout} 

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

    const notifyRoomMembers = function (roomNumber, messageType, data) {

      let sender = socket.id;
      let nsp = socket.nsp.name;

      if (!app.rooms[nsp]) app.rooms[nsp] = [];
      if (app.rooms[nsp][roomNumber]) {
        app.rooms[nsp][roomNumber].forEach(member => {
          if (member != sender) socket.to(member[0]).emit(messageType, data);
        });
      }
    }

    const othersInRoom = function (roomNumber) {
      let sender = socket.id;
      let nsp = socket.nsp.name;

      if (!app.rooms[nsp][roomNumber] || app.rooms[nsp][roomNumber].length <= 1) {
        return null;
      } else {
        let others = app.rooms[nsp][roomNumber].filter(el => el[0] != sender).map(el => el[1]);
        // console.log(`room ${room}: `);
        return others;
      }
    }

    /** Remove from rooms and delegate firstInRoom if needed */
    const removeFromRooms = function () {
      if (app.rooms[socket.nsp.name]) app.rooms[socket.nsp.name].forEach((key,index) => {
        let record = app.rooms[socket.nsp.name][index].find(el => el[0] == socket.id);
        if (record) {
          app.rooms[socket.nsp.name][index] = app.rooms[socket.nsp.name][index].filter(el => el[0] != socket.id);
          if (app.rooms[socket.nsp.name][index].length > 0 && record[2] == true) assignNewFirst(index);
          notifyRoomMembers(index, 'removeHero', record[1]);
          socket.nsp.emit('chat', { message: `<dropped out of the game>`, playerName });
        }
      })
    }

    const assignNewFirst = function(roomNumber) {
      let member = app.rooms[socket.nsp.name][roomNumber][0]; // select the first member
      member[2] = true; // set firstInRoom = true;
      socket.to(member[0]).emit('setFirstInRoom', true);
    }
    
    const updateHeroTemplate = function (room,heroTemplate) {
      let x = app.rooms[socket.nsp.name][room].find(el => el[0] == socket.id);
      if (x) x[1] = heroTemplate;
    }

    // Default namespace = "/" (equivalent to io.sockets)
    // if (!app.games[socket.nsp.name]) app.games[socket.nsp.name] = {};
    if (!app.rooms[socket.nsp.name]) app.rooms[socket.nsp.name] = [];

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
    socket.on('joinroom', (data, callback) => {
      
      // Join up with the room:
      if (!app.rooms[socket.nsp.name][data.level]) app.rooms[socket.nsp.name][data.level] = [];
      
      // Am I the first in the room?
      let firstInRoom = app.rooms[socket.nsp.name][data.level].length == 0;
      app.rooms[socket.nsp.name][data.level].push([socket.id,null,firstInRoom]);

      // Exit other rooms:
      app.rooms[socket.nsp.name].forEach((key,index) => {
        if (index != data.level) {
          app.rooms[socket.nsp.name][index] = app.rooms[socket.nsp.name][index].filter(el => el[0] != socket.id);
        }
      })

      if (!firstInRoom) socket.nsp.emit('multiplayer', true);
      callback(firstInRoom);

    });

    socket.on('pullOthers', (level, callback) => {
      // If room contains others, callback with array of heroTemplates
      let others = othersInRoom(level);
      callback(others);
    })


    /** 
     * data: { heroTemplate: ..., description: <level description>, level: ... } 
     * 
     * 
     */
    socket.on('introduce', (data) => {

      updateHeroTemplate(data.level, data.heroTemplate);

      // Notify the others
      playerName = data.heroTemplate.name;
      socket.nsp.emit('chat', { message: `<is in the ${data.description}>`, playerName });
      notifyRoomMembers(data.level, "introduce", data.heroTemplate);

    });

    socket.on('pullLayout', (level, callback) => {
      callback(app.layouts[socket.nsp.name][level]);
    });

    socket.on('pushLayout', data => {
      if (!app.layouts[socket.nsp.name]) app.layouts[socket.nsp.name] = [];
      app.layouts[socket.nsp.name][data.level] = data.layout;
    })

    socket.on('updateEntityPositions', (data) => {
      notifyRoomMembers(data.level, 'updateEntityPositions', data.positions);
      // console.log(`${app.rooms[socket.nsp.name][data.level]}`);
    });

    /** data: { layoutId: ..., rotation: ..., velocity: ..., position: ..., level: ...} */
    socket.on('updateHeroPosition', (data) => {
      // console.log(`${socket.id} with ${data.layoutId} updating position`);
      notifyRoomMembers(data.level, 'updateHeroPosition', data);
    })

    socket.on('gameProps', (data) => {
      app.games[socket.nsp.name] = data; // save for join-game lookups
      // socket.nsp.emit('gameProps', data); // can I only broadcast.emit to others in the nsp?
    });

    socket.on('disconnect', (reason) => {

      if (Object.keys(socket.nsp.sockets).length == 0) {
        delete app.games[socket.nsp.name];
      }

      removeFromRooms();

      console.log(`Disconnecting ${socket.id}`)
    });
  })

})

module.exports = app; //for testing
