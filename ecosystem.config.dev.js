module.exports = {
  apps: [
    {
      name: 'mongo',
      script: 'mongod',
      args: '--dbpath /Users/norton/mongo/data/db',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '384M',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: '3DvirtualLife',
      script: './server.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      cwd: '/Users/norton/projects/3DvirtualLife',
      interpreter: '/Users/norton/.nvm/versions/node/v14.21.3/bin/node',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NVM_DIR: '/Users/norton/.nvm',
        PATH: '/Users/norton/.nvm/versions/node/v14.21.3/bin:' + process.env.PATH
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        NVM_DIR: '/Users/norton/.nvm',
        PATH: '/Users/norton/.nvm/versions/node/v14.21.3/bin:' + process.env.PATH
      }
    }
  ]
};
