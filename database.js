const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

module.exports = function (mongoose, callback) {

    const CONNECTION_STRING = process.env.DB || "mongodb://localhost:27017/nortonAdventure";


    const savedGameSchema = mongoose.Schema({
        gameName: {type: String, unique: true, required: true},
        savedBy: String,
        props: String,
        heroTemplate: String
    });
      
    const SavedGame = mongoose.model('SavedGame', savedGameSchema);

    const userSchema = mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      roles: {type: [String], default: ['player']},
      firstname: String,
      surname: String
    });
    
    const UserModel = mongoose.model('User', userSchema);

    const clientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    mongoose.connect(CONNECTION_STRING, clientOptions)
    .then(

      (db) => {
        callback(db);
      },
  
      (err) => {
          console.log('Database error: ' + err.message);
      }
    ); 
}