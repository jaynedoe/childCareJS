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
  let sql = `SELECT * FROM users WHERE userID='${req.user.id}'`;
  let sqlUserDetails = {
    firstName: '',
    lastName: ''
  };
  
  sqlDB.query(sql, (err, results) => {
    if(err)
    {
      console.log(err);
    } else {
      sqlUserDetails.firstName = results[0].firstName;
      sqlUserDetails.lastName = results[0].lastName;
      res.render("home", { foundSQLUser: sqlUserDetails });
    }
  });
});

appRouter.get("/account", function (req, res) {
    let mongoUserName = req.user.username;
    let sql = `SELECT * FROM users WHERE userID='${req.user.id}'`;
    let sqlUserDetails = {
      firstName: '',
      lastName: ''
    };
    sqlDB.query(sql, (err, results) => {
      if(err)
      {
        console.log(err);
      } else {
        sqlUserDetails.firstName = results[0].firstName;
        sqlUserDetails.lastName = results[0].lastName;
        res.render("account", { foundSQLUser: sqlUserDetails, userNameMongo: req.user.username });
      }
    });
});

appRouter.get("/savedScenarios", function (req, res) {
    res.render("savedScenarios", { foundUser: req.user });
});

appRouter.get("/profile", function (req, res) {
    res.render("profile", { foundUser: req.user });
});

appRouter.get("/resources", function (req, res) {
    res.render("resources");
});

appRouter.get("/about", function (req, res) {
    res.render("about");
});

module.exports = appRouter;
