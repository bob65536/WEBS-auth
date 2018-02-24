***********
1-Projet.js
***********



.. code-block:: js

	// Loading the dependencies (defined beforehand)
	var express = require('express');
	var jwt = require('jsonwebtoken');
	const http = require('http');
	var app = express();
	var fs = require('fs');
	app.use(express.static('public'));
	app.set("view engine", "ejs");

	// The homepage, without token needed.
	app.get('/', function(req, res){
	  res.send("Hello World! This is a normal webpage, with nothing important");
	})

	// We define the path for the secret access
	// (this needs a valid token)
	// In a real world scenario we would authenticate user credentials
	// before creating a token, but for simplicity accessing this route

	app.get('/getToken', function(req, res){
	  var token = jwt.sign({username:"ado"}, 'supersecret',{expiresIn: 12});
	  res.send("The token is: "+token);
	})

	// Register a route that requires a valid token to view data
	app.get('/secret', function(req, res){
	  var token = req.query.token;
	  jwt.verify(token, 'supersecret', function(err, decoded){
		if(!err){
		//var secrets = {"accountNumber" : "938291239","pin" : "11289","account" : "Finance"};
			//fs.createReadStream("./static/html/secret.html", "utf8")
		//res.json(secrets);
			//res.render("Secret: Blblblblblb!");
		   console.log("Come in, you can!");
			res.render("secret")
		} else {
			//res.send("ERROR!");
		//res.send(err);
			//fs.createReadStream("./static/html/STOP.html", "utf8")
			console.log("No! You can't access there!");
			res.render("STOP.ejs");
		}
	  })
	})

	// Launch our app on port 3000
	app.listen('3000');
	console.log("Running...");
