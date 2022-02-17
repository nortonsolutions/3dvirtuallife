utils\pskill.exe -nobanner mongod.exe
utils\pskill.exe -nobanner node.exe
del utils\data\db\mongod.lock

cmd.exe /C utils\mongo\bin\mongod.exe --storageEngine=mmapv1 --port=27018 --dbpath=utils\data\db --quiet > logs\mongod.log
