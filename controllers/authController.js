const passport = require("passport");

const googleOAuth = () => 
{
   return passport.authenticate("google", { scope: ["profile", "email"] })
}


const githubOAuth = () => 
{
   return passport.authenticate("github")
}



const googleCallback = () => {
   passport.authenticate("google")
   return (req,res) => {
     res.redirect('/');
   }
}

const githubCallback = (req, res) => {
    passport.authenticate('github', { failureRedirect: '/' })
    return (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
}

const currentUser = (req,res) => {
   return res.send(req.user)
}

module.exports = {
    googleOAuth: googleOAuth,
    githubOAuth: githubOAuth,
    googleCallback: googleCallback,
    githubCallback: githubCallback,
    currentUser: currentUser
}