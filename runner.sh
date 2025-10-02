#!/bin/bash
export NVM_DIR=/Users/norton/.nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export PATH=$PATH:$NVM_DIR

nvm use 14
cd /Users/norton/projects/3DvirtualLife/
node server.js
