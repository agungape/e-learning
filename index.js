const express = require ("express");
const mysql = require ("mysql");

const app = express()

//buat koneksi ke database
var db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : ""
})

//koksikan ke database
db.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
})


// var db = mysql.createConnection({
//     host: "localhost",
//     user: "dian",
//     password: "kopi"
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

app.get("/", (request, response) => {
    response.send ("OK")
})

app.listen(3000, () => {
    console.log("server siap");
})