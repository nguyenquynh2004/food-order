const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ====================================
   MYSQL POOL CONNECTION
==================================== */

const db = mysql.createPool({

    connectionLimit: 10,

    host: process.env.MYSQLHOST,

    user: process.env.MYSQLUSER,

    password: process.env.MYSQLPASSWORD,

    database: process.env.MYSQLDATABASE,

    port: process.env.MYSQLPORT

});

console.log("✅ MYSQL CONNECTED");

/* ====================================
   ROOT
==================================== */

app.get("/", (req, res) => {

    res.send("🚀 Server running");

});

/* ====================================
   LOGIN ADMIN
==================================== */

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

                console.log(err);

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

/* ====================================
   GET FOODS
==================================== */

app.get("/foods", (req, res) => {

    const sql = `
    
        SELECT * FROM foods
        ORDER BY id DESC

    `;

    db.query(sql, (err, result) => {

        if(err){

            console.log(err);

            res.send(err);

        }else{

            res.send(result);

        }

    });

});

/* ====================================
   ADD FOOD
==================================== */

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

                console.log(err);

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

/* ====================================
   CREATE ORDER
==================================== */

app.post("/orders", (req, res) => {

    const {

        customer,
        total

    } = req.body;

    const sql = `
    
        INSERT INTO orders
        (customer, total)

        VALUES (?, ?)

    `;

    db.query(

        sql,

        [

            customer,
            total

        ],

        (err, result) => {

            if(err){

                console.log(err);

                res.send(err);

            }else{

                res.send({

                    success: true,
                    message: "Đặt hàng thành công"

                });

            }

        }

    );

});

/* ====================================
   GET ORDERS
==================================== */

app.get("/orders", (req, res) => {

    const sql = `
    
        SELECT * FROM orders
        ORDER BY id DESC

    `;

    db.query(sql, (err, result) => {

        if(err){

            console.log(err);

            res.send(err);

        }else{

            res.send(result);

        }

    });

});

/* ====================================
   SERVER
==================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("🚀 Server started");

});