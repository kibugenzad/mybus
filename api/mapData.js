const express = require('express');
const router = express.Router();
const randtoken = require('rand-token');
const moment = require('moment');

const db = require("../db/connection")

router.post("/", function (req, res) {
    console.log(req.body)
    if (req.body.latitude !== undefined || req.body.latitude !== undefined) {
        if (req.body.plate_number !== '') {
            const sql_check_bus = "SELECT bus_key FROM bus_map_data WHERE plate_number = ?";
            db.connection.query(sql_check_bus, [req.body.plate_number], function (err, result) {
                if (err) {
                    return console.log("select", err.stack)
                }
                console.log(result)
                if (result.length > 0) {
                    //update bus record
                    const sql_update = "UPDATE bus_map_data SET latitude = ?, longitude = ?, title = ?, description = ? WHERE bus_key = ?";
                    db.connection.query(sql_update, [req.body.latitude, req.body.latitude, result.title, result.description, result[0].bus_key], function (err, updated_res) {
                        if (err) {
                            return console.log("update", err.stack)
                        }

                        console.log("updated")
                    })
                } else {
                    if (req.body.latitude !== '' && req.body.longitude !== '') {
                        let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        const bus_key = randtoken.generate(250);
                        const sql = "INSERT INTO `bus_map_data` (`id`,`bus_key`,`plate_number`,`fleet_number`,`countings`,`latitude`,`longitude`,`title`,`description`,`last_update`,`date_created`) VALUES (0, ?, ? ,?, ?, ?, ?, ?, ?)";
                        db.connection.query(sql, [bus_key, req.body.plate_number, req.body.fleet_number, req.body.countings, req.body.latitude, req.body.longitude, req.body.plate_number, req.body.description, mysqlTimestamp, mysqlTimestamp], function (err, result) {
                            if (err) {
                                return console.log(err.stack)
                            }

                            console.log("inserted")
                        })
                    } else {
                        console.log("coordinates is empty")
                    }
                }
            })
        }
    }
});

module.exports = router;