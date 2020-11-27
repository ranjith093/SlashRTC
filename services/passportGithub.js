const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
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
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
        proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ githubId: profile.id })
            if(existingUser) {
                // we already have a record with the given profile id.
               return done(null, existingUser);
            }
            // we dont have a user record with this ID, make a new record.
            const user = await new User({ googleId: profile.id }).save()
            done(null, user)
            
        }
    )
);