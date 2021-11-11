//required modules for the web application
var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer');
var un=null;
var nodemailer = require('nodemailer');
const opencage = require('opencage-api-client');
//sending emails using nodemailer module
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'treattheneedy123@gmail.com',
    pass: 'Foodwaste'
  }
});

var app = express();

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

var sess;
const DIR = './uploads';
//initializing variables for uploading files using multer module
let storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, DIR + '/' + sess.typeofuser);
	},
	filename: function (req, file, cb) {
		//console.log(file)
		cb(null, file.fieldname + '_' + sess.username + path.extname(file.originalname));
	}
});
 
let upload = multer({ storage: storage });

//database connection 
var con = mysql.createConnection
({
  host: "localhost",
  user: "root",
  password: "password",
  database: "foodwaste"
});

con.connect(function(err) 
   {
  	if (err) throw err;
  	console.log("Connected!");
  });
// function to find the distance between two coordinates
function distance(lat1,lat2, lon1, lon2)
{       // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 =  lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        // Haversine formula 
        let dlon = lon2 - lon1; 
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(lat1) * Math.cos(lat2)
                 * Math.pow(Math.sin(dlon / 2),2);
        let c = 2 * Math.asin(Math.sqrt(a));
        // Radius of earth in kilometers. Use 3956 
        // for miles
        let r = 6371;
        // calculate the result
        return(c * r);
}
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

	
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//app listening in port 8080
app.listen(8080, () => 
{
	console.log("application statrted");
});
//the response for the first request
app.get("/", function(req, res)
{
	var sql="select d_username,sum(quantity) from food_takeup_request where date(r_time)=current_date() group by d_username ORDER BY SUM(quantity) DESC";
	con.query(sql, function (err, data, fields) {
    if (err) throw err; 
	res.render("homepage",{userData:data[0].d_username}); 
	console.log(data); });
});

//display the verification request of donors

app.get("/viewVerReqD", function(req, res)
{
    console.log(__dirname);
    var sql="SELECT * from donor_verification where status='pending'";
	con.query(sql, function (err, data, fields) {
    if (err) throw err; 
	res.render("viewVerReqD",{userData: data}); 
	console.log(data); });
	
});

//display the verification request of receivers
app.get("/viewVerReqR", function(req, res)
{
    console.log(__dirname);
    var sql="SELECT * from receiver_verification where status='pending'";
	con.query(sql, function (err, data, fields) {
    if (err) throw err; 
	res.render("viewVerReqR",{userData: data}); 
	console.log(data); });
});

//display the information of a selected donor
app.get("/acceptVerrequest/:d_name/:req_id", function(req, res)

{
	var d_uname = req.params.d_name;
	//d_uname=d_uname.slice(1);
	reqid=req.params.req_id;
	//reqid=reqid.slice(1)
	console.log(d_uname,reqid);
	
	
	var sql1="SELECT * from donor where d_username='"+ d_uname + "'";
	 con.query(sql1, function (err, d_data, fields) {
	 if (err) throw err;
	 var sql2="SELECT * from donor_verification where req_id='"+reqid + "'";
	 con.query(sql2, function (err, req_data, fields) {
     if (err) throw err;
	 console.log(d_data);
	 console.log(req_data);
	 
	 res.render("acceptverrequestD",{d_data:d_data,req_data:req_data});});});
	
	
});

//display the information of a selected receiver
app.get("/acceptVerrequestR/:r_name/:req_id", function(req, res)

{
	var r_uname = req.params.r_name;
	reqid=req.params.req_id;
	console.log(r_uname,reqid);
	
	
	var sql1="SELECT * from receiver where r_username='"+ r_uname + "'";
	 con.query(sql1, function (err, d_data, fields) {
	 if (err) throw err;
	 var sql2="SELECT * from receiver_verification where req_id='"+reqid + "'";
	 con.query(sql2, function (err, req_data, fields) {
     if (err) throw err;
	 console.log(d_data);
	 console.log(req_data);
	 
	 res.render("acceptverrequestR",{d_data:d_data,req_data:req_data});});});
	
	
});

//download the aaadhar card of donor
app.get("/aadhard/:something",function(req, res)
{
	var reqid = req.query.reqid;
	var sql2="SELECT file1,file2 from donor_verification where req_id='"+reqid + "'";
	con.query(sql2, function (err, req_data, fields) {
    if (err) throw err;
		
	res.download(__dirname+"/uploads/donor/" + req_data[0].file1 ,function(err)
	{
		console.log(err);
	});
	});

});

//download the supporting document of donor
app.get("/supdocd/:something",function(req, res)
{
	var reqid = req.query.reqid;
	var sql2="SELECT file1,file2 from donor_verification where req_id='"+reqid + "'";
	con.query(sql2, function (err, req_data, fields) {
    if (err) throw err;
	res.download(__dirname+"/uploads/donor/" + req_data[0].file2,function(err)
	{
		console.log(err);
		
		
	});
	});

	
});

//download the aaadhar card of receiver
app.get("/aadharr",function(req, res)
{
	var reqid = req.query.reqid;
	var sql2="SELECT file1,file2 from receiver_verification where req_id='"+reqid + "'";
	con.query(sql2, function (err, req_data, fields) {
    if (err) throw err;
		
	res.download(__dirname+"/uploads/receiver/" + req_data[0].file1,function(err)
	{
		console.log(err);
	});
	});

});

//download the supporting document of receiver
app.get("/supdocr",function(req, res)
{
	var reqid = req.query.reqid;
	var sql2="SELECT file1,file2 from receiver_verification where req_id='"+reqid + "'";
	con.query(sql2, function (err, req_data, fields) {
    if (err) throw err;
	res.download(__dirname+"/uploads/receiver/" + req_data[0].file2,function(err)
	{
		console.log(err);
		
		
	});
	});

	
});

//updates the table when admin accepts/declines the donor request
app.get("/acceptd",function(req, res)
{
	
	var reqid = req.query.reqid;
	var choice = req.query.choice;
	var d_uname = req.query.duname;
	console.log(d_uname);
	
    if(choice === 'accept' )
	{
	var sql = "UPDATE donor_verification SET status='accepted' where req_id ='"+ reqid + "'";
	con.query(sql, function (err, data, fields) {
    if (err) throw err; 
	var sql1 = "UPDATE donor SET ver_status='verified' where d_username ='"+ d_uname + "'"; 
	con.query(sql1, function (err, data, fields) {
    if (err) throw err;
	});});
	}
	
	if(choice === 'decline')
	{
	var sql = "UPDATE donor_verification SET status='declined' where req_id ='"+ reqid + "'";
	con.query(sql, function (err, data, fields) {
    if (err) throw err; });
	}
	
    var sql1="SELECT * from donor_verification where status='pending'";
	con.query(sql1, function (err, data, fields) {
    if (err) throw err; 
	res.render("viewVerReqD",{userData: data}); 
	console.log(data); });
	
	
});

//updates the table when admin accepts/declines the receiver request
app.get("/acceptr",function(req, res)
{
	
	var reqid = req.query.reqid;
	var choice = req.query.choice;
	var r_uname = req.query.runame;
	console.log(r_uname);
	
	
    if(choice === 'accept' )
	{
	var sql = "UPDATE receiver_verification SET status='accepted' where req_id ='"+ reqid + "'";
	con.query(sql, function (err, data, fields) {
    if (err) throw err;
    var sql1 = "UPDATE receiver SET ver_status='verified' where r_username ='"+ r_uname + "'"; 
	con.query(sql1, function (err, data, fields) {
    if (err) throw err;
	});	});
	}
	
	if(choice === 'decline')
	{
	var sql = "UPDATE receiver_verification SET status='declined' where req_id ='"+ reqid + "'";
	con.query(sql, function (err, data, fields) {
    if (err) throw err; });
	}
	
    var sql1="SELECT * from receiver_verification where status='pending'";
	con.query(sql1, function (err, data, fields) {
    if (err) throw err; 
	res.render("viewVerReqR",{userData: data}); 
	console.log(data); });
	
	
});

//display the donor details 
app.get("/editdetailsdonor/:d_name", function(req, res)

{
	var d_uname = req.params.d_name;
	//d_uname=d_uname.slice(1);
	console.log(d_uname);
	
	
	var sql="SELECT * from donor where d_username='"+ d_uname + "'";
	 con.query(sql, function (err, d_data, fields) {
	 if (err) throw err;
	 
	 console.log(d_data);
	 
	 res.render("editdetailsdonor",{d_data});});
	
});

//update the donor details
app.get("/Update",function(req, res)
{
	
	
	var choice = req.query.choice;
	var d_uname = req.query.d_name;
	
	var d_pwd=req.query.dpassword;
    var d_name=req.query.dname;
	var d_addr=req.query.daddr;
    var d_phone=req.query.dphone;
    var d_email=req.query.demail;
	console.log(d_name);
	
    if(choice === 'Update' )
	{
	var sql = "UPDATE donor SET d_name='"+ d_name +"',d_password='"+ d_pwd +"',d_addr='"+ d_addr +"',d_phone='"+ d_phone +"',d_email='"+ d_email +"' where d_username ='"+ d_uname + "'";
	con.query(sql, function (err, data, fields) {
    if (err) throw err; 
	res.redirect("/donordash"); 
	console.log(data);
	});
	}
});

//display the receiver details
app.get("/editdetailsreceiver/:r_name", function(req, res)

{
	var r_uname = req.params.r_name;
	//d_uname=d_uname.slice(1);
	console.log(r_uname);
	
	
	var sql="SELECT * from receiver where r_username='"+ r_uname + "'";
	 con.query(sql, function (err, d_data, fields) {
	 if (err) throw err;
	 
	 console.log(d_data);
	 
	 
	 res.render("editdetailsreceiver",{d_data});});
	
	
});

//update the receiver details
app.get("/UpdateR",function(req, res)
{
	
	
	var choice = req.query.choice;
	var r_uname = req.query.r_name;
	
	var r_pwd=req.query.rpassword;
    var r_name=req.query.rname;
	var r_addr=req.query.raddr;
    var r_phone=req.query.rphone;
    var r_email=req.query.remail;
	console.log(r_uname);
	
    if(choice === 'Update' )
	{var lat="";
	   var lng="";
	   opencage
  		.geocode({ q: r_addr })
  		.then((data) => {
    // console.log(JSON.stringify(data));
    	if (data.results.length > 0) {
      	const place = data.results[0];
      	
      	console.log(place.geometry);
      	lat=place.geometry.lat;
      	lng=place.geometry.lng;
    	console.log(r_addr);
    	console.log(lat,lng);
    
	var sql = "UPDATE receiver SET r_name='"+ r_name +"',r_password='"+ r_pwd +"',r_addr='"+ r_addr +"',r_lat='"+ lat +"',r_long='"+ lng +"',r_phone='"+ r_phone +"',r_email='"+ r_email +"' where r_username ='"+ r_uname + "'";
	con.query(sql, function (err, data, fields) {
    if (err) throw err; 
	res.redirect("/receiverdash"); 
	console.log(data);
	});
}
});
	}
});

//display the request history of donor
app.get('/requesthistoryd', function(req, res, next) {
    var sql="SELECT * FROM food_takeup_request WHERE d_username='" + un + "'";
    con.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('requesthistoryd',{ title : 'Donor Request History', userData: data});
  });
});

//display the accept history of receiver
app.get('/requesthistoryr', function(req, res, next) {
    var sql="SELECT * FROM accept_food_takeup inner join food_takeup_request WHERE accept_food_takeup.req_id=food_takeup_request.req_id and r_username='" + un + "'";
    var i=0; 
    var items=[];
    con.query(sql, function (err, data, fields) {
    if (err) throw err;
    
    res.render('requesthistoryr',{ title : 'Accept Request History', userData: data});
  });
});

//display login page
app.get("/Login", function(req, res)
{
console.log(__dirname);
    res.render("login" );
});

//display donorrequest page for the donor to post the request
app.get("/donorrequest", function(req, res)
{
    res.render("donorrequest" );
});

//display the donor dashboard
app.get('/donordash', function (req, res, next) {

	sess = req.session;
	var name = sess.username;
	console.log(name);
	var sql = "SELECT d_username,ver_status FROM donor WHERE d_username='" + name + "'";
	con.query(sql, function (err, result) {
		if (err) throw err;

		if (sess.username && result != '') {
			if (sess.username === result[0].d_username) {
				res.render("donordash",{d_uname:name,ver_status:result[0].ver_status});
			}
		}
		else {
			res.redirect('Login')

		}
	})

});

//display donorverification page for the donor to send verification request
app.get('/donorverification', function (req, res, next) {
	sess = req.session;
	var sql = 'select status from donor_verification where d_username = ?';
	sess = req.session;
	var name = sess.username;
	con.query(sql, [name], function (err, data, fields) {
		console.log(data)
		if (err) throw err;

		if (sess.username && data == '') {

			res.render('donorverification', {
				usernamee: sess.username
			});

		}
		else {
			
			res.redirect('donordash')
			
		}
	});

});

//update the tables and allows to download the aadhar and supporting doc of donor
app.post("/donorverification", upload.fields([{
	name: 'aadhaar', maxCount: 1
}, {
	name: 'supportingdoc', maxCount: 1
}]), (req, res) => {
	
	var un = req.body.username;
	var uf = req.files.aadhaar[0].filename;
	var uff = req.files.supportingdoc[0].filename;
	var ur = req.body.reqtype;
	//console.log(uf);
	
		var sql = `INSERT INTO donor_verification (d_type,d_username,file1,file2) VALUES('${ur}','${un}','${uf}','${uff}')`;
		//console.log(uff);
		con.query(sql, function (err, result) {
			if (err) throw err;
				//res.render('error', { error: err });
			else{
				res.redirect("/donordash");
			}
			// else {
				
			// 	res.redirect("/donordash");
			// }
		})
	

});

//display the receiver dashboard
app.get('/receiverdash', function (req, res, next) {
	sess = req.session;
	var name = sess.username;
	var sql = "SELECT r_username,ver_status FROM receiver WHERE r_username='" + name + "'";
	con.query(sql, function (err, result) {
		if (err) throw err;

		if (sess.username && result != '') {
			if (sess.username === result[0].r_username) {
				res.render('receiverdash',{r_uname:name,ver_status:result[0].ver_status});
			}
		}

		else {
			res.redirect('Login')

		}
	})
});

//display receiververification page for the donor to send verification request
app.get('/receiververification', function (req, res, next) {

	sess = req.session;

	var sql = 'select status from receiver_verification where r_username = ?';
	var name = sess.username;
	con.query(sql, [name], function (err, data, fields) {
		if (err) throw err;

		if (sess.username && data == '') {

			res.render('receiververification', {
				r_usernamee: sess.username
			});
		}
		else {
			res.redirect('receiverdash')

		}
	});

});

//update the tables and allows to download the aadhar and supporting doc of receiver
app.post("/receiververification", upload.fields([{
	name: 'aadhaar', maxCount: 1
}, {
	name: 'supportingdoc', maxCount: 1
}]), (req, res) => {

	
	var un = req.body.username;
	var uf = req.files.aadhaar[0].filename;
	var uff = req.files.supportingdoc[0].filename;
	var ur = req.body.reqtype;
	//console.log(uf);
	
		var sql = `INSERT INTO receiver_verification (r_type,r_username,file1,file2) VALUES('${ur}','${un}','${uf}','${uff}')`;
		//console.log(uff);
		con.query(sql, function (err, result) {
			if (err) throw err;
				//res.render('error', { error: err });
			else{
				res.redirect("/receiverdash");
			}
			// else {
				
			// 	res.redirect("/donordash");
			// }
		})	
});

//displays the register page
app.get('/register', function(req, res, next) {
    
    res.render('register');
  
});

//dispalys the incorrect password page
app.get('/incorrectpwd', function(req, res, next) {
    
    res.render('incorrectpwd');
  
});

//diaplays the username already exists page
app.get('/exists', function(req, res, next) {
    
    res.render('exists');
  
});

//displays the acceptrequest page where the donor requests are displayed
app.get("/acceptrequest", function(req, res)
{	sess = req.session;
	var name = sess.username;
	
	var sql='select * from food_takeup_request where HOUR(timediff(now(),r_time))<f_validity';
    con.query(sql, function (err, data, fields) {
    if (err) throw err;
    	var sql1="SELECT r_lat,r_long FROM receiver WHERE r_username='" + name + "'";
    	con.query(sql1, function (err, data1, fields) {
    	if (err) throw err;
    	var r_lat=data1[0].r_lat;
  		var r_long=data1[0].r_long;
  		var i=0;
  		var dist=[];

    for (let i = 0; i < data.length; i++) {
    	if(data.length==0)
    	{
    		break;
    	}
  		var d_lat=data[i].latitude;
  		var d_long=data[i].longitude;
  		

  		dist[i]=distance(r_lat,d_lat,r_long,d_long);
  		data[i].dist=distance(r_lat,d_lat,r_long,d_long).toFixed(2);
  		
	}
	
    res.render("acceptrequest",{userData: data,d_uname:name} );
    });
});
});

//updates the tables based on the quantity once request is accepted
app.post("/acceptqty", function(req, res)
{	
	var req_id=req.body.id;
	var qty=req.body.qty;
	var r_username=req.body.r_name;
	console.log(r_username);
	var sql='SELECT * FROM food_takeup_request where req_id=' + req_id + '';
    con.query(sql, function (err, data, fields) {
    if (err) throw err;
    //create table Accept_food_takeup(accept_id integer primary key not null auto_increment,req_id integer not null,d_username varchar(10),foreign key(d_username) references donor(d_username),d_phone varchar(10) unique not null check(LENGTH(d_phone) = 10),d_email varchar(30),d_verified varchar(10),qty_accepted integer not null,food_takeup_addr varchar(80) not null,r_username varchar(10),foreign key(r_username) references receiver(r_username),r_phone varchar(10) unique not null check(LENGTH(r_phone) = 10),r_email varchar(30),r_verified varchar(10) );

    var d_username=data[0].d_username;
    var address=data[0].food_takeup_addr;
    var d_phone=data[0].d_phone;
    var d_email=data[0].d_email;
    console.log(d_username);
    var no_of_people_served=data[0].no_of_people_served;
    var sql="SELECT ver_status FROM donor where d_username='" + d_username + "'";
    con.query(sql, function (err, data, fields) {
    if (err) throw err;
    var dver_status=data[0].ver_status;
    var sql="SELECT r_phone,r_email,ver_status FROM receiver WHERE r_username='" + r_username + "'";
    con.query(sql, function (err, data) {
    if (err) throw err;
    var r_phone=data[0].r_phone;
    var r_email=data[0].r_email;
    var rver_status=data[0].ver_status;
    var sql = "INSERT INTO Accept_food_takeup(req_id,d_username ,d_phone,d_email,d_verified,qty_accepted,food_takeup_addr,r_username ,r_phone,r_email,r_verified,a_time) VALUES (" + req_id + ",'" + d_username + "','" + d_phone + "','" + d_email + "','" + dver_status + "','" + qty + "','" + address + "','" + un + "','" + r_phone + "','" + r_email + "','" + rver_status + "',now())";

    con.query(sql, function (err, data) {
    if (err) throw err;
    var mailOptions = {
  		from: 'treattheneedy123@gmail.com',
  		to: d_email,
  		subject: 'Regarding the acceptance of your food takeup request',
  		text: 'Your request has been accepted by '+r_username+'\nAccepted quantity:'+qty+' '
	};
	console.log(mailOptions.to);

    	transporter.sendMail(mailOptions, function(error, info){
  		if (error) {
    	console.log(error);
  		} 	else {
    	console.log('Email sent: ' + info.response);
  	}
});
    if(no_of_people_served>=qty)
    {
    	var sql = "UPDATE food_takeup_request SET no_of_people_served=" + (no_of_people_served-qty) + " WHERE req_id=" + req_id + "";

    	con.query(sql, function (err, data) {
    	if (err) throw err;
    	res.redirect("/receiverdash");
		});
    }
  
});
});
});
});
});

//checks the username and password of donor,receiver,admin during login
app.post("/Login", (req, res) => 
{
	if(req.body.submit)
	{  
		sess = req.session;
		un = req.body.username;
		sess.username = un;
	   un=req.body.username;
	   console.log(un);
	   
	   var pwd=req.body.password;
	   var user=req.body.users;
	   sess.typeofuser = user;
	   var received="";
	   
  		if(user=="donor")
  		{
  			var sql="SELECT d_password FROM " + user + " WHERE d_username='" + un + "'";
  			con.query(sql, function (err, result) 
  			{
    			if (err) throw err;
    		
    			if (result[0].d_password===pwd)
    			{  
    				res.redirect("/donordash");
					
    			}
    			else
    			{
    				res.redirect("/incorrectpwd");
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
    				res.redirect("/receiverdash");
					
    			}
    			else
    			{
    				res.redirect("/incorrectpwd" );
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
    				res.render("admindash");
    			}
    			else
    			{
    				res.redirect("/incorrectpwd" );
    			}

  			});
  		}
  		
	} 
	if(req.body.back)
	{
 	   res.redirect('/Login.html' );

	}
});

//updates the tables once the donor posts the food take up request
app.post("/donorrequest", (req, res) => 
{	
	//if(req.body.submit)
	//{
	   var noofpeople=req.body.noofppl;
	   var takeupaddr=req.body.takeupaddr;
	   var valid=req.body.validity;
	   var items=req.body.items;
	   var addr="";
	   var phone="";
	   var lat="";
	   var lng="";
	   opencage
  		.geocode({ q: takeupaddr })
  		.then((data) => {
    // console.log(JSON.stringify(data));
    	if (data.results.length > 0) {
      	const place = data.results[0];
      	
      	console.log(place.geometry);
      	lat=place.geometry.lat;
      	lng=place.geometry.lng;
    	var sql="SELECT d_phone,d_email FROM donor WHERE d_username='" + un + "'";
  			con.query(sql, function (err, result) 
  			{
    			if (err) throw err;

	   			var sql = "INSERT INTO food_takeup_request(d_username,d_phone,d_email,d_verified,no_of_people_served ,items,food_takeup_addr,latitude,longitude, f_validity,r_time,quantity) VALUES('" + un + "','" + result[0].d_phone + "','" + result[0].d_email + "','" + result[0].ver_status + "'," + noofpeople + ",'" + items + "','" + takeupaddr + "','" + lat + "','" + lng + "'," + valid +",now()," + noofpeople + ")";
  			con.query(sql, function (err, result) 
  			{
    			if (err) 
    			{	
    				throw err;
    			}
    			else{
    			res.redirect("/donordash");
				}	
  			});

  			});
    	} else {
      	console.log('Status', data.status.message);
      	console.log('total_results', data.total_results);

    	}
  	})
  	.catch((error) => {
   
    console.log('Error', error.message);
    
    if (error.status.code === 402) {
      console.log('hit free trial daily limit');
      console.log('become a customer: https://opencagedata.com/pricing');
    }
  });
	   
  			
});
  		
//inserts the new donors and receivers values when they register  		
app.post("/register", (req, res) => 
{
	if(req.body.submit)
	{
	   un=req.body.username;
	   var pwd=req.body.password;
	   var user=req.body.users;
	   var name=req.body.name;
	   var addr=req.body.address;
	   var phone=req.body.phoneno;
	   var email=req.body.email;
	   if(user=="donor")
  		{
  			var sql = "INSERT INTO donor VALUES('" + un + "','" + name + "','" + phone + "','" + addr + "','" + email + "','" + pwd +"')";
  			con.query(sql, function (err, result) 
  			{
    			if (err) 
    			{	res.redirect('exists')
    				
    			}
    			else{
    			res.redirect("/Login" );
				}	
  			});
  		}
  		if(user=="receiver")
  		{	var lat="";
	   var lng="";
	   opencage
  		.geocode({ q: addr })
  		.then((data) => {
    // console.log(JSON.stringify(data));
    	if (data.results.length > 0) {
      	const place = data.results[0];
      	
      	console.log(place.geometry);
      	lat=place.geometry.lat;
      	lng=place.geometry.lng;
    	
  			var sql = "INSERT INTO receiver(r_username,r_name,r_phone,r_addr,r_email,r_password,r_lat,r_long) VALUES('" + un + "','" + name + "','" + phone + "','" + addr + "','" + email + "','" + pwd +"','" + lat +"','" + lng +"')";
  			con.query(sql, function (err, result) 
  			{
    			if (err) 
    			{	throw err;
            console.log(err);
         			res.redirect('exists')
    				
    			}
    			else{
    			res.redirect("/Login" );
				}	
  			});
    	} else {
      	console.log('Status', data.status.message);
      	console.log('total_results', data.total_results);

    	}
  	})
  	.catch((error) => {
    // console.log(JSON.stringify(error));
    console.log('Error', error.message);
    // other possible response codes:
    // https://opencagedata.com/api#codes
    if (error.status.code === 402) {
      console.log('hit free trial daily limit');
      console.log('become a customer: https://opencagedata.com/pricing');
    }
  });
  			
  		}
   		
	} 
	
});

//redirects to login page when back is clicked
app.post("/incorrectpwd", (req, res) => 
{	if(req.body.back){
 	   res.redirect('/login' );

	}
});

//redirects to register page when register is clicked
app.post("/exists", (req, res) => 
{	if(req.body.back){
 	   res.redirect('/register' );

	}
});
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;