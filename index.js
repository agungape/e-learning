const express = require ("express");
const mysql = require ("mysql");


const app = express()


//buat koneksi ke database
var db = mysql.createConnection({
    host : "localhost",
    database : "kodeta",
    user : "root",
    password : ""
})

//koksikan ke database
db.connect(function(err){
    if (err) throw err;
    console.log("Connected!");

    //get data dari database
    app.get("/product", (req, res) =>{
        const sql = "SELECT * FROM product"

        db.query(sql, (err, result) =>{
            console.log(err)
            console.log("hasil database = ", result)
            const product = JSON.parse(JSON.stringify(result))
            res.json({data : product})
        })

    })
})


app.listen(3000, () => {
    console.log("server siap");
})