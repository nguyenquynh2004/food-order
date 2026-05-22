const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// CHO PHÉP TRUY CẬP ẢNH
app.use("/uploads", express.static("uploads"));

// KẾT NỐI MYSQL
const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "food_order"

});

db.connect((err) => {

    if(err){
        console.log("Kết nối thất bại");
    }else{
        console.log("Kết nối MySQL thành công");
    }

});

// CẤU HÌNH UPLOAD ẢNH
const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/");

    },

    filename: function(req, file, cb){

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({ storage: storage });

// TEST SERVER
app.get("/", (req, res) => {

    res.send("Server running...");

});

// LẤY DANH SÁCH MÓN ĂN
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

// THÊM MÓN ĂN
app.post("/foods", (req, res) => {

    const { name, price, image, description } = req.body;

    const sql = `
        INSERT INTO foods(name, price, image, description)
        VALUES (?, ?, ?, ?)
    `;

    db.query(

        sql,
        [name, price, image, description],

        (err, result) => {

            if(err){
                res.send(err);
            }else{
                res.send("Thêm món ăn thành công");
            }

        }

    );

});

// XÓA MÓN ĂN
app.delete("/foods/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM foods WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if(err){
            res.send(err);
        }else{
            res.send("Xóa món ăn thành công");
        }

    });

});

// UPDATE MÓN ĂN
app.put("/foods/:id", (req, res) => {

    const id = req.params.id;

    const { name, price, image, description } = req.body;

    const sql = `
        UPDATE foods
        SET name = ?, price = ?, image = ?, description = ?
        WHERE id = ?
    `;

    db.query(

        sql,
        [name, price, image, description, id],

        (err, result) => {

            if(err){
                res.send(err);
            }else{
                res.send("Cập nhật món ăn thành công");
            }

        }

    );

});

// UPLOAD ẢNH
app.post("/upload", upload.single("image"), (req, res) => {

    if(!req.file){

        return res.send("Không có file");

    }

    res.send({

        imageUrl:
        `http://localhost:3000/uploads/${req.file.filename}`

    });

});
// API ĐẶT HÀNG
app.post("/orders", (req, res) => {

    const { customer_name, total_price } = req.body;

    const sql = `
    
        INSERT INTO orders(customer_name, total_price)
        VALUES (?, ?)

    `;

    db.query(

        sql,
        [customer_name, total_price],

        (err, result) => {

            if(err){

                res.send(err);

            }else{

                res.send("Đặt hàng thành công");

            }

        }

    );

});
// LOGIN ADMIN
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = `
    
        SELECT * FROM users
        WHERE username = ?
        AND password = ?

    `;

    db.query(

        sql,
        [username, password],

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
// DASHBOARD STATS
app.get("/dashboard", (req, res) => {

    const dashboard = {};

    // TOTAL FOODS
    db.query(
        "SELECT COUNT(*) AS totalFoods FROM foods",
        (err, foodsResult) => {

            dashboard.totalFoods =
            foodsResult[0].totalFoods;

            // TOTAL ORDERS
            db.query(
                "SELECT COUNT(*) AS totalOrders FROM orders",
                (err, ordersResult) => {

                    dashboard.totalOrders =
                    ordersResult[0].totalOrders;

                    // TOTAL REVENUE
                    db.query(
                        `
                            SELECT 
                            SUM(total_price) AS totalRevenue
                            FROM orders
                        `,
                        (err, revenueResult) => {

                            dashboard.totalRevenue =
                            revenueResult[0].totalRevenue || 0;

                            res.send(dashboard);

                        }
                    );

                }
            );

        }
    );

});
// CHẠY SERVER
app.listen(3000, () => {

    console.log("Server started");

});