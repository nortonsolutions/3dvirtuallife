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

const app = express();

// TODO: Thread safety may become a concern for app.rooms

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
    });

    socket.on('updateHeroTemplate', (data) => {
      updateHeroTemplate(data.level, data.heroTemplate);
      notifyRoomMembers(data.level, "updateHeroTemplate", data.heroTemplate);
    });

    socket.on('nextLayoutId', (roomNumber, callback) => {
      callback(app.layouts[socket.nsp.name][roomNumber][1]++);
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

      if (Object.keys(socket.nsp.sockets).length == 0) {
        delete app.games[socket.nsp.name];
      }

      removeFromRooms();
      console.log(`Disconnecting ${socket.id}`)
    });


    socket.on('death', data => {
      
      app.layouts[socket.nsp.name][data.level][0].entities = app.layouts[socket.nsp.name][data.level][0].entities.filter(el => el.attributes.layoutId != data.layoutId);
      notifyRoomMembers(data.level, 'death', data);

      // if (data.hero) {  // remove from room/layouts
      //   removeFromRooms();
      // }
    });

    const updateHeroAttributes = function (room,payload) {
      let x = app.rooms[socket.nsp.name][room].find(el => el[0] == socket.id);
      if (x) x[1].attributes = {...x[1].attributes, ...payload};
      // notifyRoomMembers(room, "updateHeroAttributes", x[1]);
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
            // TODO!!! handle hero attribute updates.  update template?

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
