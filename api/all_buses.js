const express = require('express');
const router = express.Router();

const db = require("../db/connection");

//get all buses
router.post("/", function (req, res) {
    //select conductors
    const conductor_sql = "SELECT id FROM `bus_info` WHERE conductor = ?";
    db.connection.query(conductor_sql, [req.body.conductor], function (err, conductor_result) {
        if (err){
            console.log(err.stack);
        }

        if (conductor_result.length == 1){
            const sql = "SELECT bi.plate_number, bi.passengers,bi.driver_name, bi.conductor, bi.conductor, li.latitude, li.longitude FROM bus_info as bi LEFT JOIN location_info as li ON li.plate_number = bi.plate_number WHERE bi.conductor = ?";
            db.connection.query(sql, [req.body.conductor], function (err, result) {
                if (err) {
                    console.log("status", err.stack)
                }

                res.status(200).json({"data": result, "my_data": "exist"})
            })
        }else{
            const sql = "SELECT bi.plate_number, bi.passengers,bi.driver_name, bi.conductor, bi.conductor, li.latitude, li.longitude FROM bus_info as bi LEFT JOIN location_info as li ON li.plate_number = bi.plate_number";
            db.connection.query(sql, function (err, result) {
                if (err) {
                    console.log("status", err.stack)
                }

                res.status(200).json({"data": result, "my_data": "notexist"})
            })
        }
    })
});

module.exports = router;
