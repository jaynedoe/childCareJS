const mongoUser = require("../noSql");
const Router = require("express").Router;
const passport = require("passport");
const sqlDB = require("../sql");

const authRouter = new Router();

authRouter.get("/register", function (req, res) {
  res.render("register");
});

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
  
          let sql = `INSERT INTO users VALUES ('${user.id}', 'User', 'User')`;

          sqlDB.query(sql, (err, results, fields) => {
            if(err){
              console.log(err);
            }else{
              console.log(`Success! User added to SQL DB.`);
            }
          });
  
          res.redirect("/");
        }
      }
    );
  });

  const authenticateMiddleware = function(req, res, next) {
    if(req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  }

  authRouter.get('/login', (req, res) => {
    res.render('login')
  });


  authRouter.post("/login", async function (req, res, next) {
    const { username, password } = req.body
    const dbUser = await mongoUser.findOne({ username })

    //find username in mongoDB, if not found return to login page
 
    if(!dbUser) {
      return res.redirect('/login');
    }

    //check passwords match

    if(password){
      dbUser.authenticate(password, function(err, model, passwordError){
        if(passwordError){
          console.log(passwordError)
          res.redirect("/")
        } else if(model){
          console.log(`Correct password with model ${model}`)
          req.login(dbUser, (err) => {
            if(err){
              return console.log(err)
            }
            res.redirect("/")
          })
        }            
      })
    } else {
      console.log("no password entered")
      res.redirect("/")
    }

  });

  module.exports = authRouter;
  module.exports.authenticateMiddleware = authenticateMiddleware