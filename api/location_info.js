const express = require('express');
const router = express.Router();
const moment = require('moment');

const db = require("../db/connection");
let message = [];

//get updates buses
router.put("/:plate_number", function (req, res) {

    console.log(req.params.plate_number);

    let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    var callback = function(message) {
        res.status(200).json(message);
    }

    //check if plate number
    const sql_is_plate_no_exist = "SELECT `bus_id` FROM `bus_info` WHERE plate_number = ?";
    db.connection.query(sql_is_plate_no_exist, [req.params.plate_number], function (err, result) {
        if (err) {
            console.log("select",err.stack)
            message.push({"status": "error_searching_plate_no"})
        }

        if (result.length == 1){
            const sql_update_location = "UPDATE location_info SET latitude = ?, longitude = ?, time_stamp = ? WHERE plate_number = ?";
            db.connection.query(sql_update_location,[req.body.latitude, req.body.longitude, mysqlTimestamp, req.params.plate_number], function (err, result) {
                if (err) {
                    console.log("location update",err.stack);
                    message.push("status", "error")
                }

                message.push({"status": "location_info_updated "});

                //for update passengers, driver_name, conductor
                const sql_update_bus = "UPDATE bus_info SET passengers = ?, conductor = ?, driver_name = ?, time_stamp = ? WHERE plate_number = ?";
                db.connection.query(sql_update_bus,[req.body.passengers, req.body.conductor, req.body.driver_name, mysqlTimestamp, req.params.plate_number], function (err, result) {
                    if (err) {
                        console.log("bus_info update",err.stack);
                        return message.push("status", "bus_info_updated")
                    }
                });
            });
        }else{
            message.push({"status": req.params.plate_number+" "+"doesn't exist"});
        }

        callback(message);
    });
});

module.exports = router;