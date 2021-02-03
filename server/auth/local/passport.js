var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../../config/mysql')

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      var query = "select * from account_management where login_id='"+ email + "'"
              +" AND password = '"+ password +"'"
              console.log(query)
        db.get().query(query, function (err,user) {
          console.log(err)
          console.log(user)
          if (err) return done(err);

          if (!user) {
            return done(null, false, { message: 'This email is not registered.' });
          }
  
          if (!user.status == "active") {
            return done(null, false, { message: 'This email is not verified.' });
          }
  
          // if (!user.authenticate(password)) {
          //   return done(null, false, { message: 'This password is not correct.' });
          // }
          return done(null, user[0]);
        })
      // User.findOne({
      //   email: email.toLowerCase()
      // }, function(err, user) {
      //   if (err) return done(err);

      //   if (!user) {
      //     return done(null, false, { message: 'This email is not registered.' });
      //   }

      //   if (!user.verified) {
      //     return done(null, false, { message: 'This email is not verified.' });
      //   }

      //   if (!user.authenticate(password)) {
      //     return done(null, false, { message: 'This password is not correct.' });
      //   }
      //   return done(null, user);
      // });
    }
  ));
};
