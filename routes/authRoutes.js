const express = require("express")

const passport = require("passport");

const router = express.Router()


router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
router.get(
  "/github",
  passport.authenticate("github"))

  router.get('/logout', (req,res) => {
     req.logout();
     res.redirect('/')   
 })

 router.get("/google/callback", 
  passport.authenticate("google"),
  (req,res) => {
    res.redirect('/');
  }
  );

  router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });




  router.get("/current_user", (req, res) => {
    res.send(req.user); 
  });

  module.exports = router