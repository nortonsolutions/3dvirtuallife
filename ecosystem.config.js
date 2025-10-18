require('dotenv').config();

var NVM_DIR = '/Users/norton/.nvm';
var NVM_BIN = '/Users/norton/.nvm/versions/node/v14.21.3/bin';
var project_dir = '/Users/norton/projects/3DvirtualLife';

module.exports = {
  apps: [
    {
      name: '3DvirtualLife',
      script: './server.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      cwd: project_dir,
      interpreter: NVM_BIN + '/node',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NVM_DIR: NVM_DIR,
        PATH: NVM_BIN + ':' + process.env.PATH
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        NVM_DIR: NVM_DIR,
        PATH: NVM_BIN + ':' + process.env.PATH
      }
    }
  ]
};
