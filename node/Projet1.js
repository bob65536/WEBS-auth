// Loading the dependencies (defined beforehand)
var express = require('express');
var jwt = require('jsonwebtoken');
const http = require('http');
var app = express();
var fs = require('fs');
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

// Dependencies for Passport
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Functions for Passport
	// For strategy
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { 
		console.log("ERR"); 
		return cb(err);
 	    }
      if (!user) { 
		console.log("!=USR?"); 
		return cb(null, false);  
		}
      if (user.password != password) { 
		return cb(null, false); 
		}
      return cb(null, user);
    });
  }));
	// Serializing : Name -> An ID
	// Deserializing: ID (if exists) -> Name
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
  
// Initialize Passport and restore previous state
app.use(passport.initialize());
app.use(passport.session());


  
// The homepage, without token needed (defining routes)
app.get('/', function(req, res){
  console.log(req.user);
  res.render('homepage', { user: req.user });
  //res.send("Hello World! This is a normal webpage, with nothing important");
})

// We define the path for the secret access
// (this needs a valid token)
// In a real world scenario we would authenticate user credentials
// before creating a token, but for simplicity accessing this route
app.get('/getToken', function(req, res){
  var token = jwt.sign({username:"MSWS"}, 'supersecret',{expiresIn: 12});
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write("The token is: "+token+"<br />");
  res.write("You can access to a secret by going on this URL : <br />");
  res.write("<a href='http://node.aneth.ovh1.ec-m.fr/secret?token="+token+"'>My biggest secrets</a><br />");
  res.end("Be fast, this token is valid during 12 seconds!");
})

// Register a route that requires a valid token to view data
app.get('/secret', function(req, res){
  var token = req.query.token;
  jwt.verify(token, 'supersecret', function(err, decoded){
    if(!err){
        console.log("Come in, you can!");
        res.render("secret")
    } else {
        console.log("No! You can't access there!");
        res.render("STOP"); // the webpage when there is an error
    }
  })
})

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

// Else, when you enter a non-valid URL (put the sound up :D ) !
app.use((req, res, next) => {
  res.status(404).render("404")
})

// Launch our app on port 10404
app.listen('10404');
console.log("Running...");

