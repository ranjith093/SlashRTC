const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("github", profile);
      let existingUser = await User.findOne({ "githubProfile.id": profile.id });

      if (existingUser) {
        // we already have a record with the given profile id.
        return done(null, existingUser);
      }
      existingUser = await User.findOne({ email: profile.email });
      if (existingUser) {
        await User.findByIdAndUpdate(
          existingUser.id,
          {
            githubProfile: {
              id: profile.id,
              email: profile.email,
              name: profile.name,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return done(null, existingUser);
      } else {
        const user = await new User({
          email: profile.email,
          password: "aasdasfasasf",
          githubProfile: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
          },
        }).save()
        return done(null, user);
      }
      // console.log("github", profile)
      // // we dont have a user record with this ID, make a new record.
      // const user = await new User({ "githubProfile.id": profile.id }).save()
      // done(null, user)
    }
  )
);
