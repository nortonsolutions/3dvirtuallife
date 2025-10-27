/**
 * Norton 2022 - 3D Virtual Life Game
 */

'use strict';

const express     = require('express');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const cors        = require('cors');
// const fs          = require('fs');
// const multer      = require('multer');
const dotenv      = require('dotenv');

const auth                     = require('./auth.js');
const apiRoutes                = require('./routes/api.js');
const hbsHelpers               = require('./public/handlebarsHelpers.js')
const hbs                      = require('express-hbs');
const mongoose                 = require('mongoose');
const passport                 = require('passport');

// For unit and functional testing with Chai later:
// var expect            = require('chai').expect;
// var fccTestingRoutes  = require('./routes/fcctesting.js');
const runner                   = require('./test-runner');
const database                 = require('./database.js');
const socket                   = require('socket.io');
const envResult                = dotenv.config({ path: './.env' });


// Global error handlers for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[Process] Uncaught Exception:', error);
  // Log error but don't exit in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
  // Log error but don't exit in production
});

const app = express();
const dotenvVars = envResult.error ? {} : envResult.parsed;
const base_url = `${dotenvVars.PROTOCOL}://${dotenvVars.HOSTNAME}:${dotenvVars.PORT}`;

console.log(`Base URL: ${base_url}`);

app.dpConfig = {
  GAME_PREVIEW_IMAGES:  [
    "https://github.com/nortonsolutions/3dvirtuallife/raw/main/3dvirtuallife_1.png",
    "https://github.com/nortonsolutions/3dvirtuallife/raw/main/3dvirtuallife_2.png",
    "https://github.com/nortonsolutions/3dvirtuallife/raw/main/3dvirtuallife_3.png",
    "https://github.com/nortonsolutions/3dvirtuallife/raw/main/3dvirtuallife_4.png",
    "https://github.com/nortonsolutions/3dvirtuallife/raw/main/3dvirtuallife_5.png"
  ],

  base_url,
  ...dotenvVars
}

// TODO: Thread safety may become a concern for app.rooms

app.gameStarts = {}; // catalog of startTime per namespace
app.gameTimes = {}; // catalog of periodSinceStart intervals per namespace
app.games = {}; // catalog of 'namespaces' (games)
app.rooms = {}; // current room membership; app.rooms[nsp][room] is an array of [socket.id,heroTemplate,firstInRoom]
app.layouts = {}; // layouts for each room/level; app.layouts[nsp][room] = [{layout},maxLayoutId] 

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
  
  app.use(session({
    secret: process.env.SESSION_SECRET || "WHATEVER",
    resave: true,
    saveUninitialized: true
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  //For FCC testing purposes
  // fccTestingRoutes(app);

  auth(app, db.models.User);
  apiRoutes(app, db);
  
  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });

  // Global error handler
  app.use(function(err, req, res, next) {
    console.error('[Express] Error:', err.stack);
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong!' 
        : err.message
    });
  });
  
  // Start our server and tests!
  var server = app.listen(process.env.INTERNAL_PORT || 3001, function () {
    console.log(`[Server] Listening on port ${process.env.INTERNAL_PORT || 3001}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
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

  // Socket setup with optimizations
  var io = socket(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling'],
    // Enable compression for better performance
    perMessageDeflate: {
      threshold: 1024 // Compress messages larger than 1KB
    },
    // Connection timeout
    pingTimeout: 60000,
    pingInterval: 25000
  });

  /**  
   * Allow regex for multiple namespaces in future socket.io release:
   * 
   * io.of(/.+/).on('connection', (socket) => {
   * 
   * For now, I'll use just one universal namespace (i.e. one game per server).
   *   -Dave 
   */
  
  // Global error handler for socket.io
  io.on('connect_error', (error) => {
    console.error('Socket.io connection error:', error);
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] New connection - ${socket.id} from ${socket.handshake.address}`);

    // Add error handler for this socket
    socket.on('error', (error) => {
      console.error(`[Socket.io] Error on socket ${socket.id}:`, error);
    });

    socket.on('connect_error', (error) => {
      console.error(`[Socket.io] Connect error for ${socket.id}:`, error);
    });

    // provides a phase of the day, 0-3, based on time since server start
    const checkDayPhase = function(roomNumber) {

      // when was the game started?
      var gameStart;
      if (app.gameStarts[socket.nsp.name]) {
        gameStart = app.gameStarts[socket.nsp.name];
      } else {
        gameStart = app.gameStarts[socket.nsp.name] = new Date();
      }

      let p = 3 - Number(Number((new Date() - gameStart)/1000/60/60%3).toFixed(0)); // 0..3
      // last periodSinceStart
      if (app.gameTimes[socket.nsp.name]) {
        if (app.gameTimes[socket.nsp.name] != p) {
          app.gameTimes[socket.nsp.name] = p;
          console.log(p);
          notifyAllRoomMembers(roomNumber, 'updateDayPhase', p);
        }
      } else {
        app.gameTimes[socket.nsp.name] = p;
        
        notifyAllRoomMembers(roomNumber, 'updateDayPhase', p);
      } 
    }

    const notifyRoomMembers = function (roomNumber, messageType, data) {

      // log unless messageType is updateHeroPosition
      if (messageType != 'updateHeroPosition' && messageType != 'updateEntityPositions' && messageType != 'addSprites') {
        console.log(`[Socket.io] notifyRoomMembers: room ${roomNumber}, ${messageType}`);
      }

      let sender = socket.id;
      let nsp = socket.nsp.name;
      
      // TODO: Use Socket.io's built-in room broadcasting (more efficient)
      // const roomKey = `${`nsp}_room_${roomNumber}`;
      // socket.to(roomKey).emit(messageType, data);

      // Still maintain app.rooms for backward compatibility and member tracking
      if (!app.rooms[nsp]) app.rooms[nsp] = [];
      if (app.rooms[nsp][roomNumber]) {
        app.rooms[nsp][roomNumber].forEach(member => {
          if (member[0] != sender) socket.to(member[0]).emit(messageType, data);
        });
        // Only check day phase occasionally to reduce overhead
        if (Math.random() < 0.05) checkDayPhase(roomNumber);
      }
    }

    // notify all including the original socket
    const notifyAllRoomMembers = function (roomNumber, messageType, data) {
      let nsp = socket.nsp.name;
      if (!app.rooms[nsp]) app.rooms[nsp] = [];
      if (app.rooms[nsp][roomNumber]) {
        app.rooms[nsp][roomNumber].forEach(member => {
          socket.to(member[0]).emit(messageType, data);
        });
        socket.emit(messageType, data);
      }
      
      // TODO: Use Socket.io's built-in room broadcasting (includes sender)
      // const roomKey = `${nsp}_room_${roomNumber}`;
      // io.to(roomKey).emit(messageType, data);
    }

    const getSocketByLayoutId = function (roomNumber, layoutId) {
      if (app.rooms[socket.nsp.name][roomNumber]) {
        let filteredList = app.rooms[socket.nsp.name][roomNumber].filter(el => el[1].attributes.layoutId == layoutId);
        if (filteredList && filteredList[0]) return filteredList[0][0]; // [socket.id,heroTemplate,firstInRoom]
      } else {
        return null;
      }
    }

    const othersInRoom = function (roomNumber) {
      let sender = socket.id;
      let nsp = socket.nsp.name;

      if (app.rooms[nsp]) {
        if (!app.rooms[nsp][roomNumber] || app.rooms[nsp][roomNumber].length <= 1) {
          return null;
        } else {
          let others = app.rooms[nsp][roomNumber].filter(el => el[0] != sender).map(el => el[1]);
          return others;
        }
      } else return null;
    }

    /** Remove from rooms and delegate firstInRoom if needed */
    const removeFromRooms = function () {
      if (app.rooms[socket.nsp.name]) app.rooms[socket.nsp.name].forEach((key,index) => {
        let record = app.rooms[socket.nsp.name][index].find(el => el[0] == socket.id);
        if (record) {
          app.rooms[socket.nsp.name][index] = app.rooms[socket.nsp.name][index].filter(el => el[0] != socket.id);
          if (app.rooms[socket.nsp.name][index].length > 0 && record[2] == true) assignNewFirst(index);
          notifyRoomMembers(index, 'removeHero', record[1]);
          socket.nsp.emit('chat', { message: `<left the area>`, playerName });
        }
      })
    }

    const assignNewFirst = function(roomNumber) {
      let member = app.rooms[socket.nsp.name][roomNumber][0]; // select the first member
      member[2] = true; // set firstInRoom = true;
      socket.to(member[0]).emit('setFirstInRoom', true);
    }
    
    const updateHeroTemplate = function (room,heroTemplate) {
      // log
      console.log(`updateHeroTemplate - ${socket.id} - ${heroTemplate.attributes.layoutId} = ${heroTemplate.name}`);
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
      try {
        const nsp = socket.nsp.name;
        
        // Initialize rooms structure
        if (!app.rooms[nsp]) app.rooms[nsp] = [];
        if (!app.rooms[nsp][data.level]) app.rooms[nsp][data.level] = [];
        
        // Am I the first in the room?
        let firstInRoom = app.rooms[nsp][data.level].length === 0;
        
        // TODO: Socket.io native room support (newer version) might optimize performance later (previous imp)
        // const roomKey = `${nsp}_room_${data.level}`;
        // socket.join(roomKey);
        // console.log(`[Socket.io] Socket ${socket.id} joined room ${roomKey}`);
        
        // Add to app.rooms for member tracking
        app.rooms[nsp][data.level].push([socket.id, null, firstInRoom]);

        // Exit other rooms
        app.rooms[nsp].forEach((key, index) => {
          if (index != data.level) {
            // TODO: Socket.io native room support (newer version) might optimize performance later (previous imp)
            // const oldRoomKey = `${nsp}_room_${index}`;
            // socket.leave(oldRoomKey);
            app.rooms[nsp][index] = app.rooms[nsp][index].filter(el => el[0] != socket.id);
            socket.rooms.delete(socket.id)
          }
        });

        if (!firstInRoom) socket.nsp.emit('multiplayer', true);
        callback(firstInRoom);
      } catch (error) {
        console.error('[Socket.io] Error in joinroom:', error);
        callback(false);
      }
    });

    socket.on('pullOthers', (level, callback) => {
      try {
        // If room contains others, callback with array of heroTemplates
        let others = othersInRoom(level);
        callback(others);
      } catch (error) {
        console.error('[Socket.io] Error in pullOthers:', error);
        callback(null);
      }
    });

    socket.on('updateHeroTemplate', (data) => {
      try {
        updateHeroTemplate(data.level, data.heroTemplate);
        notifyRoomMembers(data.level, "updateHeroTemplate", data.heroTemplate);
      } catch (error) {
        console.error('[Socket.io] Error in updateHeroTemplate:', error);
      }
    });

    socket.on('nextLayoutId', (roomNumber, callback) => {
      try {
        if (!app.layouts[socket.nsp.name]) app.layouts[socket.nsp.name] = [];
        if (!app.layouts[socket.nsp.name][roomNumber]) app.layouts[socket.nsp.name][roomNumber] = [{}, 1];
        callback(app.layouts[socket.nsp.name][roomNumber][1]++);
      } catch (error) {
        console.error('[Socket.io] Error in nextLayoutId:', error);
        callback(1);
      }
    });

    socket.on('dropItemToScene',  (data) => {
      notifyRoomMembers(data.level, "dropItemToScene", data);
    });

    socket.on('takeItemFromScene', data => {
      notifyRoomMembers(data.level, "takeItemFromScene", data);
    });

    socket.on('addItemToLayout', data => { // Update the local copy of the layout

      if (data.item.type && data.item.type == "structure") {
        app.layouts[socket.nsp.name][data.level][0].structures.push(data.item);
      } else if (data.item.type && data.item.type == "item") {
        app.layouts[socket.nsp.name][data.level][0].items.push(data.item);
      } else if (data.item.type && (data.item.type == "entity" || data.item.type == "beast" || data.item.type == "friendly")) {
        app.layouts[socket.nsp.name][data.level][0].entities.push(data.item);
      }
      notifyRoomMembers(data.level, "addItemToLayout", data);
    });

    socket.on('removeFromLayoutByLayoutId', data => {

      let layout = app.layouts[socket.nsp.name][data.level][0];
      
      if (layout.items.map(el => el.attributes.layoutId).includes(data.layoutId)) {
        layout.items = layout.items.filter(el => el.attributes.layoutId != data.layoutId);
      } else if (layout.entities.map(el => el.attributes.layoutId).includes(data.layoutId)) {
        layout.entities = layout.entities.filter(el => el.attributes.layoutId != data.layoutId);
      } else if (layout.structures.map(el => el.attributes.layoutId).includes(data.layoutId)) {
        layout.structures = layout.structures.filter(el => el.attributes.layoutId != data.layoutId);
      }

      // layout.items = layout.items.filter(el => el.attributes.layoutId != data.layoutId);
      notifyRoomMembers(data.level, "removeFromLayoutByLayoutId", data);
    });

    /** 
     * data: { heroTemplate: ..., description: <level description>, level: ... } 
     */
    socket.on('introduce', (data) => {

      updateHeroTemplate(data.level, data.heroTemplate);

      // Notify the others
      playerName = data.heroTemplate.name;
      socket.nsp.emit('chat', { message: `<is in the ${data.description}>`, playerName });
      notifyRoomMembers(data.level, "introduce", data.heroTemplate);
      
    });

    socket.on('pullLayout', (level, callback) => {
      callback(app.layouts[socket.nsp.name][level][0]);
    });

    socket.on('pushLayout', data => {
      if (!app.layouts[socket.nsp.name]) app.layouts[socket.nsp.name] = [];
      app.layouts[socket.nsp.name][data.level] = [data.layout,data.nextLayoutId];
    });

    socket.on('updateEntityPositions', (data) => {
      notifyRoomMembers(data.level, 'updateEntityPositions', data.positions);
    });

    /** data: { layoutId: ..., rotation: ..., velocity: ..., position: ..., level: ...} */
    socket.on('updateHeroPosition', (data) => {
      notifyRoomMembers(data.level, 'updateHeroPosition', data);
    })

    socket.on('gameProps', (data) => {
      app.games[socket.nsp.name] = data; // save for join-game lookups
      // socket.nsp.emit('gameProps', data); // can I only broadcast.emit to others in the nsp?
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.io] Socket ${socket.id} disconnecting: ${reason}`);
      try {
          if (socket.nsp.sockets?.size == 0) {
            delete app.games[socket.nsp.name];
          }
        removeFromRooms();
      } catch (error) {
        console.error('[Socket.io] Error during disconnect cleanup:', error);
      }
    });


    socket.on('death', data => {
      
      if (data.level) {
        app.layouts[socket.nsp.name][data.level][0].entities = app.layouts[socket.nsp.name][data.level][0].entities.filter(el => el.attributes.layoutId != data.layoutId);
        notifyRoomMembers(data.level, 'death', data);
      }

      if (data.hero) {  // remove hero completely (a bit overkill but it works)
        removeFromRooms();
      }
    });

    const updateHeroAttributes = function (room,payload) {
      let x = app.rooms[socket.nsp.name][room].find(el => el[0] == socket.id);
      if (x) x[1].attributes = {...x[1].attributes, ...payload};
      notifyRoomMembers(room, "updateHeroAttributes", x[1]);
    }

    socket.on('cleanupForms', room => {
      notifyRoomMembers(room, 'cleanupForms', {});
    })

    socket.on('updateAttributes', data => { // include type 
      var index;
      if (app.layouts[socket.nsp.name] && app.layouts[socket.nsp.name][data.level]) {
        switch (data.type) {
          case 'structure':
              index = app.layouts[socket.nsp.name][data.level][0].structures.findIndex(el => el.attributes.layoutId == data.layoutId);
              if (index != -1) {
                let structure = app.layouts[socket.nsp.name][data.level][0].structures[index];
                structure.attributes = {...structure.attributes, ...data.payload};
              }
              break;
          case 'item':
              index = app.layouts[socket.nsp.name][data.level][0].items.findIndex(el => el.attributes.layoutId == data.layoutId);
              if (index != -1) {
                let item = app.layouts[socket.nsp.name][data.level][0].items[index];
                item.attributes = {...item.attributes, ...data.payload};
              }
              break;
          case 'entity':
          case 'friendly':
          case 'beast':
              index = app.layouts[socket.nsp.name][data.level][0].entities.findIndex(el => el.attributes.layoutId == data.layoutId);
              if (index != -1) {
                let entity = app.layouts[socket.nsp.name][data.level][0].entities[index];
                entity.attributes = {...entity.attributes, ...data.payload};
              }
              break;
          case 'hero' :
              updateHeroAttributes(data.level, data.payload);
              break;
        }

      }

      
      // notify existing room members
      notifyRoomMembers(data.level, 'updateAttributes', data);
    });

    // data: { level: this.sceneController.level, itemName, position: item.model.position, rotation: item.model.rotation })
    socket.on('launch', data => {
      notifyRoomMembers(data.level, 'launch', data);
    });

    // data: { level: this.sceneController.level, layoutId: entity.attributes.layoutId, spell });    
    socket.on('castSpell', data => {
      let socketNumber = getSocketByLayoutId(data.level, data.layoutId);
      if (socketNumber && socketNumber != socket.id) socket.to(socketNumber).emit('castSpell', data);
    });

    // data:  { level: this.sceneController.level, spriteConfig, spritePosition });
    socket.on('addSprites', data => {
      notifyRoomMembers(data.level, 'addSprites', data);
    });

    // data: { heroInventory: this.inventory, otherLayoutId: data.layoutId, socket: this.sceneController.socket, level: this.sceneController.level, layoutId: ... } 
    socket.on('heroDialogNew', data => {
      let socketNumber = getSocketByLayoutId(data.level, data.otherLayoutId);
      if (socketNumber && socketNumber != socket.id) socket.to(socketNumber).emit('heroDialogNew', { otherLayoutId: data.layoutId, otherInventory: data.heroInventory, initiator: data.initiator });
    });

    // data: { layoutId, heroInventory, otherLayoutId, level })
    socket.on('heroDialogInventory', data => {
      let socketNumber = getSocketByLayoutId(data.level, data.otherLayoutId);
      if (socketNumber && socketNumber != socket.id) socket.to(socketNumber).emit('heroDialogInventory', data.heroInventory);
    });

    // data: { level, otherLayoutId, tab, payment });
    socket.on('heroDialogUpdateExchange', data => {
      let socketNumber = getSocketByLayoutId(data.level, data.otherLayoutId);
      if (socketNumber && socketNumber != socket.id) socket.to(socketNumber).emit('heroDialogUpdateExchange', { tab: data.payment, payment: data.tab } );
    });

    socket.on('closeModal', data => {
      let socketNumber = getSocketByLayoutId(data.level, data.otherLayoutId);
      if (socketNumber && socketNumber != socket.id) socket.to(socketNumber).emit('closeModal', {});
    });

    socket.on('heroDialogAcceptDeal', data => {
      let socketNumber = getSocketByLayoutId(data.level, data.otherLayoutId);
      if (socketNumber && socketNumber != socket.id) socket.to(socketNumber).emit('heroDialogAcceptDeal', { } );
    });

    socket.on('heroDialogProposeDeal', data => {
      let socketNumber = getSocketByLayoutId(data.level, data.otherLayoutId);
      if (socketNumber && socketNumber != socket.id) socket.to(socketNumber).emit('heroDialogProposeDeal', { } );
    });
    
    // socket.emit('changeStat', { level, layoutId, hitPointReduction });
    socket.on('changeStat', data => {
      let socketNumber = getSocketByLayoutId(data.level, data.layoutId);
      if (socketNumber && socketNumber != socket.id) socket.to(socketNumber).emit('changeStat', data );
    });
  })
})

module.exports = app; //for testing
