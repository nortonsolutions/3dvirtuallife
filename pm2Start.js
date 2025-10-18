require('dotenv').config();
var pm2 = require('pm2');

// load environment variables
var PRODUCTION_START_SCRIPT = process.env.PRODUCTION_START_SCRIPT || '/Users/norton/projects/3DvirtualLife/server.js'

var instances = process.env.INSTANCES || 1;
var pm2AppName = process.env.PM2_APP_NAME || '3DvirtualLife';
var nodeBin = '/Users/norton/.nvm/versions/node/v14.21.3/bin';
var maxMemory = process.env.MAX_MEMORY || '390M';
var nvmDir = process.env.NVM_DIR || '/Users/norton/.nvm';
var projectDir = '/Users/norton/projects/3DvirtualLife';

pm2.connect(function() {
  pm2.start(
{
      name: pm2AppName,
      script: PRODUCTION_START_SCRIPT,
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      cwd: projectDir,
      interpreter: nodeBin + '/node',
      NODE_ENV: 'development',
      PORT: 3030,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NVM_DIR: nvmDir,
        PATH: nvmDir + ":" + process.env.PATH
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        NVM_DIR: nvmDir,
        PATH: nvmDir + process.env.PATH
      }
  }, function() {
    console.log(
      'pm2 started %s with %s instances at %s max memory',
      pm2AppName,
      instances,
      maxMemory
    );
    pm2.disconnect();
  });
});
