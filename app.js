var express = require('express');
var app = express();
const bodyParser = require("body-parser");
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
var session = require('express-session');

var sql = require("mssql");
app.use( express.static( "public" ) );

var loggedInUser = null;
var userRetrieved = null;





// config for your database
var config = {
    user: 'sa',
    password: 'Welcome@1',
    server: 'LAPTOP-4VPP71JE\\SQLEXPRESS',
    port: '1433',

    database: 'arch' ,
    "options": {
      "encrypt": true,
      "enableArithAbort": true,
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
      }
    }
};


app.use (
    session ({
       secret: "secret",
       saveUninitialized: true,
       resave: true,
       cookie: {
          expires: 20 * 1000
       }
    })
 );
app.get('/all', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records

        request.query('use arch');
        request.query('select * from architects_creeds', function (err, recordset) {
            
            if (err) console.log(err);

            console.log("data is " + recordset);

            // send records as a response
            res.send(recordset);
           // console.log("data is " + recordset);
            
        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});



app.get("/main",(req,res)=>{

    res.render("mainpage.ejs");
});

app.post("/main",(req,res)=>{
    var iuname= req.body.uname;
    var ipawd= req.body.password;

    if (iuname == "" || ipawd == "") {
        console.log("please enter the details properly");
    }

});

app.get("/register",(req,res)=>{
    res.render("registration.ejs");
});

app.post("/register", (req,res)=>{

    sql.connect(config, function(err){
      
        if(err) console.log(err);

        var request = new sql.Request();
        request.query('use arch');
        // request.query(
            
            var insQueryLogin = "insert into User_Login (email_address, Password) values ('" + 
                        req.body.e_mail + "', '" + req.body.password  +  "')";

            request.query(insQueryLogin, function (err, recordset) {
            
            if (err) console.log(err);

            console.log("inserted data is  " + recordset);

           
        });

        var insQuery = "insert into architects_creeds (first_name,last_name,email_address,gender,types_of_architects) values ('" + 
                        req.body.frst_name + "', '" + req.body.lst_name + "', '" + req.body.e_mail  
                        + "', '" + req.body.gend2 + "', '" + req.body.typeArch +  "')";

        request.query(insQuery, function (err, recordset) {
            
            if (err) console.log(err);

            console.log("inserted data is  " + recordset);

            // send records as a response
     //       res.send(recordset);
           // console.log("data is " + recordset);
        });

        res.render("regSuccess.ejs");     

        // var query = "INSERT INTO test.dbo.name (First_Name,Last_name) VALUES ('" +req.body.first_Name +"','"+req.body.last_name+"')";

    })

});


app.get("/account",(req,res)=>{

    // location.reload();

    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        var request = new sql.Request();
           

        request.query('use arch');
        request.query("select * from architects_creeds where email_address = '"+ loggedInUser + "';" , function (err, recordset) {
            
            if (err) console.log(err);

            userRetrieved = recordset.recordset[0];
            console.log("architect data is " + JSON.stringify(userRetrieved));

            // send records as a response
            //res.send(userRetrieved);
           // console.log("data is " + recordset);
            
        });
    });

    res.render("account.ejs" , {
        fname : userRetrieved
    });
});


app.get("/main",(req,res)=>{
    res.render("mainpage.ejs");
});

app.get("/logout",(req,res)=>{
    res.render("mainpage.ejs");
});

app.post('/signIn', function(request, response) {
	var username = request.body.uname;
	var password = request.body.pwd;
	if (username && password) {

        sql.connect(config, function(err){
      
            if(err) console.log(err);
    
            var request = new sql.Request();
            request.query('use arch');
                
            var loginChkQuery = "SELECT * FROM User_Login WHERE email_address = '"+ username+"' AND Password = '"+password + "';"; 
            console.log("loginChkQuery is " + loginChkQuery)
            request.query(loginChkQuery, function (err, recordset) {
            
                if(isEmptyObject(recordset.recordset)){
                    console.log("Empty record set from above sql"); 
                    response.send('Bad username or password!');

                }
                else{
                    console.log("some value from select query")
                    // request.session.loggedin = true;
                    // request.session.username = username;
                    console.log("retrieved data is  " + recordset.recordset[0].email_address );
                    // response.send(recordset);
                    loggedInUser = username;
                    response.redirect('/account');
                }
                
                console.log("retrieved data is  " + recordset.recordset[0].email_address );
                response.end();
            });
        });
        
    }else {
        response.send('Please enter Username and Password!');
        response.end();
    }
		
});

function isEmptyObject(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }

