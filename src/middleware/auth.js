const connection = require("../db/sqlDb")
const jwt = require("jsonwebtoken")
const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, "hellothere")
        connection.query("SELECT * FROM userdetails WHERE username=?", [decoded._id], (err, rows, fields) => {
            if (err) {
                return res.status(400).send(err)
            }
            if (!rows[0].token && rows[0].token != token) {
                return res.status(403).send({ "error": "Please Authenticate." })
            }
            console.log(decoded);
            req.user = decoded._id
            next()
        })

    } catch (e) {
        res.status(403).send({ "error": "Please Authenticate." })
    }
}

module.exports = auth