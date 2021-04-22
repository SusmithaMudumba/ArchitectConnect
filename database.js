const express = require('express');
const mysql = require('mysql');

const app = express();
app.set("view engine", "ejs");

app.listen(2000, ()=> {
    console.log("app is running on port 2000");
})

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"groot123",
    database:"architect",
    port:"3306"
})

connection.connect((err)=>{
    if(err){
        throw err;
    }
    else {
        console.log("connected");
        connection.query("select * from architects_creeds",)

    }

})


// connection.query('CREATE TABLE archiconnects(username VARCHAR(50),password VARCHAR(50))', (err,rows) =>{
//     if(err){
//         throw err
//     }
//     else {
//         console.log("TABLE INSERTED SUCCESSFULLY");
//     }


// })


// var fnm = document.getElementById("first_name").value;
// var pwd = document.getElementById("last_name").value;

// connection.query('INSERT INTO archiconnects(username,password) VALUES(fnm,pwd)',fnm,pwd,(err, rows)=>{
//     if(err){
//         throw err
//     }
//     else{
//         console.log("data inserted successfully")
//     }
// })

// const port=process.env.PORT || 5000;
// app.listen(port);

// console.log('app is listening on port' +port);