


## 3D Virtual Life
#### Copyright Dave Norton 2022
#### Testing framework (Chai/Mocha) from FCC, though not used much
#### pointerLockControls concept from mrdoob & Mugen87

<img src="3dvirtuallife_1.png" width="400"/>
<img src="3dvirtuallife_2.png" width="400"/>
<img src="3dvirtuallife_3.png" width="400"/>
<img src="3dvirtuallife_4.png" width="400"/>
<img src="3dvirtuallife_5.png" width="400"/>

This production version assumes MongoDB is up and running on port 27017 
and uses the DB called "nortonAdventure" (wiredtiger) by default.

Unzip cdn.zip, png.zip, and 3d.zip in their respective directories for stock libraries/graphics.

Also change the reference to 172.16.0.20 to your own public IP address for socket handling.

Thanks to the graphics team: Mike Tidwell, Chris Lobato, Rodney Thinn, and Steve Leavitt.

-----

# Only applicable for auto-startup with pm2:
To configure auto-startup for pm2.exe service with pm2-windows-service module:

Launch Git Bash in Administrative Mode, then run the following:

[ /c/util/courseApp/utils/yarn-pm2-windows-service/node_modules/pm2-windows-service ]

$ bin/pm2-service-install -n pm2
? Perform environment setup (recommended)? Y
? Set PM2_HOME? Y
? PM2_HOME value: c:\3Dvirtualife\utils\node
? Set PM2_SERVICE_SCRIPTS (the list of start-up scripts for pm2)? N
? Set PM2_SERVICE_PM2_DIR (the location of the global pm2 to use with the service? Y
? Specify the directory containing the pm2 version to be used by the service:
C:\util\courseApp\utils\node\node_modules\pm2

PM2 service installed and started.

Then again in administrative mode,

$ sc \\DESKTOP-83JAE79 config pm2.exe depend= MongoDB

To check pm2 services, login to cmd or bash in Administrative mode.

$ pm2 start /c/3Dvirtuallife/server.js -i 1 --name 3Dvirtuallife
$ pm2 save

(The 'pm2 save' will cause pm2 to pick up from where it leaves off on the next restart.)

-----

Manual startup of the production server (pm2 only):

Assuming the MongoDB process is running, start 3D Virtual Life with:

pm2 start 3Dvirtuallife

Logs are in utils/node/logs

----

Manual startup of the production server (standard node):

node server.js

-----



-----

Development mode (only if you have the /utils directory):

If you want to run in development mode with a standalone DB (mmapv1), 
you can startup a local MongoDB using 'startDB.bat' instead (port 27018).  
Use F5 in Visual Studio Code to launch with .env settings.

-----

DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) 
is deprecated, plug in your own promise library instead: 
http://mongoosejs.com/docs/promises.html

Express-Session Warning: connect.session() MemoryStore 
is not designed for a production environment, as it will leak memory, 
and will not scale past a single process.