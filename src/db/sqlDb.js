var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE
});

connection.connect((err) => {
    if (err) {
        console.log("Connection to DB failed");
        return;
    }

    console.log("DB connected succesfully");
});

module.exports = connection;