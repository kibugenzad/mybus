const express = require('express');
const router = express.Router();

const db = require("../db/connection");

//get all buses
router.post("/", function (req, res) {
    const sql = "SELECT * FROM bus_map_data";
    db.connection.query(sql, function (err, result) {
        if (err) {
            return console.log("update", err.stack)
        }

        res.status(200).json({"data": result})
    })
});

module.exports = router;