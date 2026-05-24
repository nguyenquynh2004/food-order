const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// MYSQL CONNECTION
// =========================

const db = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

// TEST MYSQL

db.getConnection((err, connection) => {

    if (err) {

        console.log("❌ Kết nối MySQL thất bại");
        console.log(err);

    } else {

        console.log("✅ Kết nối MySQL thành công");

        connection.release();

    }

});

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {

    res.send("🚀 Server running");

});

// =========================
// GET FOODS
// =========================

app.get("/foods", (req, res) => {

    const sql = "SELECT * FROM foods";

    db.query(sql, (err, result) => {

        if (err) {

            res.send(err);

        } else {

            res.send(result);

        }

    });

});

// =========================
// ADD FOOD
// =========================

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

            if (err) {

                res.send(err);

            } else {

                res.send({

                    success: true,
                    message: "✅ Thêm món ăn thành công"

                });

            }

        }

    );

});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server started at port ${PORT}`);

});