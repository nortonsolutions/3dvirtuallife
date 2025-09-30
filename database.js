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
    
    // Add index for faster lookups
    savedGameSchema.index({ savedBy: 1 });
      
    const SavedGame = mongoose.model('SavedGame', savedGameSchema);

    const userSchema = mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      roles: {type: [String], default: ['player']},
      firstname: String,
      surname: String
    });
    
    // Add index for faster authentication lookups
    userSchema.index({ username: 1 });
    
    const UserModel = mongoose.model('User', userSchema);

    const clientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection pooling for better performance
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    };

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('[MongoDB] Connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected. Attempting to reconnect...');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('[MongoDB] Connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('[MongoDB] Error during shutdown:', err);
        process.exit(1);
      }
    });

    // Connection with retry logic
    const connectWithRetry = () => {
      mongoose.connect(CONNECTION_STRING, clientOptions)
        .then((db) => {
          console.log('[MongoDB] Initial connection successful');
          callback(db);
        })
        .catch((err) => {
          console.error('[MongoDB] Initial connection failed:', err.message);
          console.log('[MongoDB] Retrying connection in 5 seconds...');
          setTimeout(connectWithRetry, 5000);
        });
    };

    connectWithRetry();
};