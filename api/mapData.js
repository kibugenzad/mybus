const express = require('express');
const router = express.Router();
const randtoken = require('rand-token');
const moment = require('moment');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

const db = require("../db/connection");

let message = [];

router.post("/", function (req, res) {

    const bus_key = randtoken.generate(50);

    if (req.body.latitude !== undefined || req.body.latitude !== undefined) {
        if (req.body.plate_number !== '') {

            console.log(req.body)

            //check if plate_number existed
            const sql_chk = "SELECT bus_key FROM bus_map_data  WHERE plate_number = ?";
            db.connection.query(sql_chk, [req.body.plate_number], function (err, result_bus) {
                if(err){
                    console.log(err.stack)
                    return message.push({"status": "error"})
                }else {
                    if (result_bus.length > 0){
                        console.log(result_bus)
                        //update
                        const sql_update = "UPDATE bus_map_data SET latitude = ?, longitude = ?, passengers = ? WHERE bus_key = ?";
                        db.connection.query(sql_update, [req.body.latitude, req.body.longitude, req.body.passengers, bus_key], function (err, updated_res) {
                            if (err) {
                                return console.log("update", err.stack)
                            }
                            message.push({"status": "updated"});
                        })
                    }else{
                        console.log("insert")
                        let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        const bus_key = randtoken.generate(50);
                        const sql = "INSERT INTO `bus_map_data` (`id`,`bus_key`,`plate_number`,`fleet_number`,`passengers`,`latitude`,`longitude`,`location_name`,`description`,`last_update`,`date_created`) VALUES (0, ?, ? ,?, ?, ?, ?, ?, ?)";
                        db.connection.query(sql, [bus_key, req.body.plate_number, req.body.fleet_number, req.body.passengers, req.body.latitude, req.body.longitude, req.body.location, req.body.description, mysqlTimestamp, mysqlTimestamp], function (err, result) {
                            if (err) {
                                console.log(err.stack)
                                return message.push({"status": "error"})
                            }
                            message.push({"status": "inserted"});

                            return message;
                        })
                    }
                }
            })
        }
    }
});

module.exports = router;