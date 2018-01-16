const express = require('express');
const router = express.Router();
const moment = require('moment');

const db = require("../db/connection");

let message = [];

router.post("/", function (req, res) {

    var callback = function(message) {
        res.status(200).json(message);
    }

    let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    //check if plate number
    const sql_is_plate_no_exist = "SELECT `bus_id` FROM `bus_info` WHERE plate_number = ?";
    db.connection.query(sql_is_plate_no_exist, [req.body.plate_number], function (err, result) {
        if (err) {
            console.log(err.stack)
            message.push({"status": "error_searching_plate_no"})
        }

        if(result.length > 0){
            message.push({"status": "plate_number_exist"})
        }else{
            const sql = "INSERT INTO `bus_info`(`bus_id`, `plate_number`, `passengers`, `driver_name`, `conductor`, `end_location`, `time_stamp`) VALUES (0, ? ,?, ?, ?, ?, ?)";
            db.connection.query(sql, [req.body.plate_number, req.body.passengers, req.body.driver_name, req.body.conductor, "",mysqlTimestamp], function (err, result) {
                if (err) {
                    console.log("bus info",err.stack)
                    message.push({"status": "bus_info_error"})
                }

                message.push({"status": "bus data inserted"});

                //insert into location table
                const sql_location = "INSERT INTO `location_info`(`location_id`, `plate_number`, `latitude`, `longitude`, `time_stamp`) VALUES (0,?,?,?,?)";
                db.connection.query(sql_location, [req.body.plate_number, req.body.latitude, req.body.longitude,mysqlTimestamp], function (err, result) {
                    if (err) {
                        console.log("location",err.stack)
                        message.push({"status": "location_error"})
                    }
                    message.push({"status": "location inserted"});
                });
            })
        }

        callback(message);
    })
});

module.exports = router;