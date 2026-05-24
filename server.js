const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= MYSQL ================= */

const db = mysql.createConnection({

    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT

});

db.connect((err) => {

    if(err){

        console.log(err);

    }else{

        console.log("MySQL Connected");

    }

});

/* ================= ROOT ================= */

app.get("/", (req, res) => {

    res.send("Server running");

});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {

    const {

        username,
        password

    } = req.body;

    const sql = `
    
        SELECT * FROM users

        WHERE username = ?
        AND password = ?

    `;

    db.query(

        sql,

        [

            username,
            password

        ],

        (err, result) => {

            if(err){

                res.send(err);

            }else{

                if(result.length > 0){

                    res.send({

                        success: true,
                        message: "Đăng nhập thành công"

                    });

                }else{

                    res.send({

                        success: false,
                        message: "Sai tài khoản hoặc mật khẩu"

                    });

                }

            }

        }

    );

});

/* ================= GET FOODS ================= */

app.get("/foods", (req, res) => {

    const sql = "SELECT * FROM foods";

    db.query(sql, (err, result) => {

        if(err){

            res.send(err);

        }else{

            res.send(result);

        }

    });

});

/* ================= ADD FOOD ================= */

app.post("/foods", (req, res) => {

    const {

        name,
        price,
        image,
        description

    } = req.body;

    const sql = `
    
        INSERT INTO foods
        (name, price, image, description)

        VALUES (?, ?, ?, ?)

    `;

    db.query(

        sql,

        [

            name,
            price,
            image,
            description

        ],

        (err, result) => {

            if(err){

                res.send(err);

            }else{

                res.send({

                    success: true,
                    message: "Thêm món ăn thành công"

                });

            }

        }

    );

});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Server started");

});