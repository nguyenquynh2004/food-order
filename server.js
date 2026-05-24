const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ================= MYSQL =================

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT

});

// TEST CONNECT

db.connect((err) => {

    if (err) {

        console.log("❌ MYSQL ERROR");
        console.log(err);

    } else {

        console.log("✅ MYSQL CONNECTED");

    }

});

// ================= ROOT =================

app.get("/", (req, res) => {

    res.send("🚀 Server running");

});

// ================= GET FOODS =================

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

// ================= START =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("🚀 Server started");

});