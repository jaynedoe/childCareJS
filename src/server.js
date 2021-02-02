require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const appRouter = require("./routers/index");
const authRouter = require("./routers/auth");
const mongoUser = require("./noSql");

const session = require("express-session");
const passport = require("passport");

const app = express();

app.set("views", "src/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(mongoUser.createStrategy({
  passReqToCallback: true
}));

passport.serializeUser(mongoUser.serializeUser());
passport.deserializeUser(mongoUser.deserializeUser());

app.use("/", authRouter);
app.use("/", appRouter);

app.listen(process.env.PORT || 3000, function () {
  console.log("Server listening on port 3000.  Press Ctrl + C to exit.");
});
