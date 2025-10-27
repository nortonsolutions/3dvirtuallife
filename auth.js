/**
 * Authentication strategy - Norton 2021
 * Based on passport, passport-local, bcrypt;
 * Assumes Mongoose-style UserModel.
 */

const LocalStrategy = require('passport-local');
const bcrypt        = require('bcrypt');
const passport      = require('passport');

module.exports = function (app, UserModel) {

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
      UserModel.findOne({_id: id}, (err, doc) => {
        done(null, doc);
      });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      UserModel.findOne({ username: username }, function (err, user) {
        console.log('User '+ username +' attempted to log in.');
	      if (err) { return done(err, false); }
        if (!user || !user.password) { return done(new Error("User not found or password missing"), false); }

	      bcrypt.hash(password,12).then(hash => {
	        console.log(hash)
	      });
        
        bcrypt.compare(password, user.password).then(success => {
          if (!success) {
            return (null, false);
          } else {
	          console.log("Success with " + password + " and returning user " + user);
	          return done(null, user);
          }
        });
      });
    }
  ));
}
