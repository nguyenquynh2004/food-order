const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// MYSQL POOL CONNECTION
// =========================

const db = mysql.createPool({

    connectionLimit: 10,

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT

});

// TEST MYSQL CONNECTION

db.getConnection((err, connection) => {

    if (err) {

        console.log("Kết nối MySQL thất bại");
        console.log(err);

    } else {

        console.log("Kết nối MySQL thành công");

        connection.release();

    }

});

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {

    res.send("Server running...");

});

// =========================
// GET ALL FOODS
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
                    message: "Thêm món ăn thành công"

                });

            }

        }

    );

});

// =========================
// UPDATE FOOD
// =========================

app.put("/foods/:id", (req, res) => {

    const id = req.params.id;

    const {

        name,
        price,
        image,
        description

    } = req.body;

    const sql = `

        UPDATE foods

        SET

            name = ?,
            price = ?,
            image = ?,
            description = ?

        WHERE id = ?

    `;

    db.query(

        sql,

        [

            name,
            price,
            image,
            description,
            id

        ],

        (err, result) => {

            if (err) {

                res.send(err);

            } else {

                res.send({

                    success: true,
                    message: "Cập nhật món ăn thành công"

                });

            }

        }

    );

});

// =========================
// DELETE FOOD
// =========================

app.delete("/foods/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM foods WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            res.send(err);

        } else {

            res.send({

                success: true,
                message: "Xóa món ăn thành công"

            });

        }

    });

});

// =========================
// LOGIN ADMIN
// =========================

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

            if (err) {

                res.send(err);

            } else {

                if (result.length > 0) {

                    res.send({

                        success: true,
                        message: "Đăng nhập thành công"

                    });

                } else {

                    res.send({

                        success: false,
                        message: "Sai tài khoản hoặc mật khẩu"

                    });

                }

            }

        }

    );

});

// =========================
// CREATE ORDER
// =========================

app.post("/orders", (req, res) => {

    const {

        customer_name,
        total_price

    } = req.body;

    const sql = `

        INSERT INTO orders
        (customer_name, total_price)

        VALUES (?, ?)

    `;

    db.query(

        sql,

        [

            customer_name,
            total_price

        ],

        (err, result) => {

            if (err) {

                res.send(err);

            } else {

                res.send({

                    success: true,
                    message: "Đặt hàng thành công"

                });

            }

        }

    );

});

// =========================
// GET ORDERS
// =========================

app.get("/orders", (req, res) => {

    const sql = "SELECT * FROM orders ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {

            res.send(err);

        } else {

            res.send(result);

        }

    });

});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server started at port ${PORT}`);

});