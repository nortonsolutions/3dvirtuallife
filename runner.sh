#!/bin/bash
export NVM_DIR=/home/dave/.nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
PATH=$PATH:$NVM_DIR

nvm use 14
cd /home/dave/projects/3DvirtualLife/
node server.js
