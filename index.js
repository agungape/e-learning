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

    // Membuat Endpoint dengan params id
    app.delete("/product/:id", (req, res) => {

        // Mengambil query params id product yang di pass 
        const id = req.params.id

        // Membuat query delete product by id
        const sql = "DELETE FROM product WHERE id = ?"    // ? sebagai tanda tempat nilai akan di input
        const values = [id]  // nilai yang akan menggantikan tanda ? ,  nilai harus disimpan dalam array []

        // proses query ke database dengan argument yang diberikan yaitu (sql, nilai, callback)
        db.query(sql, values, (err, result) => {

            // Mengecek jika ada error dari query database
            if(err){
                res.status(500)
                    .json({message: "Server error", status : res.statusCode})
                    
            }else{ // jika request ke database tidak ada error

                // Memparse / mengubah data menjadi JSON Object
                let hasil = JSON.parse(JSON.stringify(result))
            
                // Mengecek apakah ada baris yang terkena efek/effect DELETE dan TIDAK ADA warning
                if(hasil.affectedRows > 0 && hasil.warningCount == 0){
                    res.status(200)
                    .json({message: "Data berhasil dihapus.", status : res.statusCode})

                }else{
                    res.status(404)
                    .json({message: "Data tidak ditemukan.", status : res.statusCode})
                }
            }

            
        })

    })
})


app.listen(3000, () => {
    console.log("server siap port 3000");
})