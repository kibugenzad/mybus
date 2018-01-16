const express = require('express');
const router = express.Router();

const db = require("../db/connection");

//get all buses
router.get("/", function (req, res) {
    const sql = "SELECT bi.plate_number, bi.passengers,bi.driver_name, bi.conductor, bi.conductor, li.latitude, li.longitude FROM bus_info as bi LEFT JOIN location_info as li ON li.plate_number = bi.plate_number";
    db.connection.query(sql, function (err, result) {
        if (err) {
            console.log("status", err.stack)
        }

        res.status(200).json({"data": result})
    })
});

module.exports = router;