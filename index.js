const express = require ("express");
const mysql = require ("mysql");
const bodyParser = require("body-parser");




const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


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
        // console.log(req.query.limit);
        
        const limit = parseInt(req.query.limit);
        let page = parseInt(req.query.page);
        page = (isNaN(page))? 1 : page;

        if(limit) {
            // limit 2
            // page = offset
            // 1 = 0 => dimulai data ke 1
            // 2 = 2 => dimulai data ke 3
            // 3 = 4 => dimulai data ke 5

            // Pola => (page * limit) - limit
            const offset = (page * limit) - limit;

            const sql = "SELECT * FROM product LIMIT ? OFFSET ?";
            const values = [limit, offset];
    
            db.query(sql, values, (err, result) =>{
                console.log(err)
                const product = JSON.parse(JSON.stringify(result))
                res.json({message: "Success", status:res.statusCode, data : product})
            })

        }else{
            res.status(400)
            .json({message:"Must be have query params 'limit'", status: res.statusCode})
        }

    })


    // Membuat Endpoint dengan params id
    app.delete("/product/:id", (req, res) => {

        // Mengambil params id product yang di pass 
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

    //membuat endpoint berdsarkan id

    app.get("/product/:id", (req, res) => {

        //mengambil params id product yg di pass
        const id = req.params.id

        //membuat query get data product by id
        const sql = "SELECT * FROM product WHERE id = ?"  // ? sebagai tanda tempat nilai akan di input 

        // nilai yang akan menggantikan tanda ? ,  nilai harus disimpan dalam array []
        const values = [id] 
        

        //execute data
        db.query(sql, values, (err, result) => {
            if (err) {
                res.status(500)
                json({message: "Server error", status : statusCode})
                console.log("error", err)
            }else{
                //mengubah data menjadi JSON Object
                const product = JSON.parse(JSON.stringify(result))
                res.json({data : product})

                // if(values){
                //     res.status(200)
                //     .json({data : product})
                // }else{
                //     res.status(404)
                //     .json({message: "Data tidak ditemukan.", status : res.statusCode})
                // }
            }
        })  
    })

    //membuat endpoint tambah_product
    app.post("/product", (req, res) => {
        const nama_product = req.body.nama;
        const harga = req.body.harga;
        const deskripsi = req.body.deskripsi;        
        console.log(nama_product, harga, deskripsi);
        //query
        const sql = "INSERT INTO product (product_name, price, description) VALUES (?,?,?)" 
        const values = [nama_product, harga, deskripsi]

        //exceute perintah
        db.query(sql, values, (err, result) => {
            if (err) {
                res.status(500)
                console.log("error", err)
            }else{
                //mengubah data menjadi JSON Object
                res.json({message : "data berhasil di tambahkan"})
            }
        })  
        
    })
})


app.listen(3000, () => {
    console.log("server siap port 3000")
})