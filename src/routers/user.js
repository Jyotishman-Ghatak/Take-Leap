const express = require("express");
const bcrypt = require("bcryptjs");
const connection = require("../db/sqlDb");
const jwt = require("jsonwebtoken")
const router = new express.Router();
const auth = require("../middleware/auth")


router.get("/", auth, (req, res) => {
    res.send("Welcome " + req.user);
})

router.post("/signup", async (req, res) => {
    let { name, username, password, age, gender } = req.body;
    password = await bcrypt.hash(password, 8);
    console.log(password);
    var sql = "INSERT INTO userdetails(name,username,password,age,gender) VALUES (?,?,?,?,?)";
    connection.query(sql, [name, username, password, age, gender], (err, rows, fields) => {
        if (err) {
            if (err.errno == 1062) {
                res.status(409).send({ err: "Username Already Exist" });
            }
            else {
                console.log(rows)
                res.status(400).send(err);
            }
        }
        else {
            res.send("User Signed Up Successfully");
        }
    })
})

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    connection.query("SELECT * FROM userdetails WHERE username=?", [username], (err, rows, fields) => {
        if (rows.length == 0) {
            return res.status(404).send({ msg: "User Doesn't Exist" });
        }
        const isMatch = bcrypt.compareSync(password, rows[0].password);
        if (!isMatch) {
            return res.send(403).send("Invalid credentials")
        }
        //console.log(rows);
        const token = jwt.sign({ _id: rows[0].username.toString() }, process.env.JWT_SECRET_KEY);
        rows[0].token = token;

        rows[0].password = undefined;
        connection.query("UPDATE userdetails SET token=? WHERE username=?", [rows[0].token, username], (err, rows, fields) => {
            if (err) {
                console.log(err)
            }
            // console.log(rows);
        })
        res.send(rows)
    });

});

router.get("/logout", auth, (req, res) => {
    connection.query("UPDATE userdetails SET token=null WHERE username=?", [req.user], (err, rows, fields) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.send("User Logged Out Successfully");
    });

})


module.exports = router;