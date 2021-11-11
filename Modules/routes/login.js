var express = require('express');
var router = express.Router();
var db=require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table
router.get('/login', function(req, res, next) {
    
    res.render('Login',);
  });
router.post('/Login', function(req, res, next) {
{
	
	   un=req.params.username;
	   var pwd=req.params.password;
	   var user=req.params.users;
	   var received="";
   		console.log(req.params.username);
   		//console.log(req);
  		if(user=="donor")
  		{		
  			var sql='SELECT d_password FROM donor WHERE d_username="${un}"';
  			console.log(sql);
  			con.query(sql, function (err, result) 
  			{	
    			if (err) throw err;
    			
    			if (result[0].d_password===pwd)
    			{
    				res.send("Login successful");
    			}
    			else
    			{
    				res.redirect("/incorrectpwd.html" );
    			}

  			});
  		}
  		if(user=="receiver")
  		{
  			var sql="SELECT r_password FROM " + user + " WHERE r_username='" + un + "'";
  			con.query(sql, function (err, result) 
  			{
    			if (err) throw err;
    		
    			if (result[0].r_password===pwd)
    			{
    				res.send("Login successful");
    			}
    			else
    			{
    				res.sendFile(__dirname + "/incorrectpwd.html" );
    			}

  			});
  		}
  		if(user=="admin")
  		{
  			var sql="SELECT ad_password FROM " + user + " WHERE ad_username='" + un + "'";
  			con.query(sql, function (err, result) 
  			{
    			if (err) throw err;
    		
    			if (result[0].ad_password===pwd)
    			{
    				res.send("Login successful");
    			}
    			else
    			{
    				res.redirect("/incorrectpwd.html" );
    			}

  			});
  		}
  	//var sql = "INSERT INTO login (UserID,Username, Userpassword) VALUES(13,'" + un + "','" + pwd +"')";
  		
	 
	// if(req.params.back)
	// {
 // 	   res.redirect('/Login.html' );

	// }//res.send(`Full name is:${req.body.username} ${req.body.password}.`);
}
});

module.exports = router;