const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path: './config/config.env'})

const User = mongoose.model('User');

passport.serializeUser((user,done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
        done(null, user);
    })
})

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("passport callback",profile)
      let existingUser = await User.findOne({"googleProfile.id": profile.id})

            if(existingUser) {
                // we already have a record with the given profile id.
               return done(null, existingUser);
            }
             existingUser = await User.findOne({email: profile.emails[0].value})
             console.log("email",profile.emails[0].value)
             if(existingUser){
                await User.findByIdAndUpdate(existingUser.id, {
                    googleProfile: {
                        id: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName
                    }
                }, {
                    new: true,
                    runValidators: true
                  });
                  return done(null, existingUser)
             } else {

                 // we dont have a user record with this ID, make a new record.
                 const user = await new User({
                     email: profile.emails[0].value,
                     password: "cccccccc",
                     googleProfile: {
                         id: profile.id,
                         email: profile.emails[0].value,
                         name: profile.displayName
                     }
                 }).save()
                 return done(null, user)
             }
            // const user = await new User({"googleProfile.id": profile.id}).save()

           
            
        }
    )
);