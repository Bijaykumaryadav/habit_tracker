//index.js
const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 8000;
//setting up mongodb
const db = require("./config/mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
//setting passport middleware
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./assets"));
app.use(expressLayouts);
//extract style and scripts from subpages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts",true);
//setting up templete engine
app.set("view engine", "ejs");
app.set("views", "./views");

//set up the session for using passport in mongo
app.use(
  session({
    name: "habit_tracker",
    secret: "something",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 80 * 60,
    },
    store: new MongoStore(
      {
        mongoUrl: "mongodb://127.0.0.1/habit_tracker_db",
      },
      {
        mongooseConnection: db,
        autoremove: "disabled",
      },
      function (err) {
        console.log(err || "successfully added mongostore");
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//using express router in the main index.js
app.use("/", require("./routes"));
//setting express router
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server : ${err}`);
  }
  console.log(`Server is running on Port: ${port}`);
});
// app.listen(port,function(err){
//     if(err){
//         console.log('Error in running the server: ',err);
//     }
//     console.log('Server is running on port: ',port);
// })
