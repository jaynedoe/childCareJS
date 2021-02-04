const sqlDB = require("../sql");
const Router = require("express").Router;

const appRouter = new Router();


appRouter.get("/", function (req, res) {
  if(req.isAuthenticated()){
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
});

appRouter.get("/home", (req, res) => {
  let sql = `SELECT Parent1Name FROM userProfiles WHERE userID='${req.user.id}'`;
  
  sqlDB.query(sql, (err, results) => {
    if(err)
    {
      console.log(err);
    } else {
      res.render("home", { parent1Name: results[0].Parent1Name });
    }
  });
});

appRouter.get("/account", function (req, res) {

    let sql = `SELECT * FROM userProfiles WHERE userID='${req.user.id}'`;

    sqlDB.query(sql, (err, results) => {
      if(err)
      {
        console.log(err);
      } else {
        res.render("account", { firstName: results[0].Parent1Name, lastName: results[0].FamilyName, userNameMongo: req.user.username });
      }
    });
});

appRouter.get("/savedScenarios", function (req, res) {
    res.render("savedScenarios", { foundUser: req.user });
});

appRouter.get("/resources", function (req, res) {
    res.render("resources");
});

appRouter.get("/about", function (req, res) {
    res.render("about");
});

module.exports = appRouter;
