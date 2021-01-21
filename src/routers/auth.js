const mongoUser = require("../noSql");
const Router = require("express").Router;
const passport = require("passport");

const authRouter = new Router();

authRouter.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

authRouter.post("/register", function (req, res) {
    mongoUser.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          console.log("New User ID: " + user.id);
  
          //SAVE TO MYSQL DATABASE HERE???
  
          res.redirect("/");
        }
      }
    );
  });

  authRouter.post("/login", function (req, res) {
    const user = new mongoUser({
      username: req.body.username,
      password: req.body.password,
    });
  
    //IS THIS WHERE I CHECK FOR INCORRECT USERNAME AND PASSWORD AND SEND MESSAGE BACK?
  
    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("dashboard/home");
        });
      }
    });
  });

  module.exports = authRouter;