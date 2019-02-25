const express = require('express');
const router = express.Router();
const moment = require('moment');

const db = require("../db/connection");

let message = [];

var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

function copyToFirebase(plate_number, passengers, driver_name, conductor, speed, latitude, longitude) {
    //save data to firebase
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://mybus-191611.firebaseio.com"
        });
    }

    admin.database().ref('mapData/' + plate_number).set({
        plate_number: plate_number,
        passengers: passengers,
        latitude: latitude,
        longitude: longitude,
        driver_name: driver_name,
        conductor: conductor,
        speed: speed,
        last_update: admin.database.ServerValue.TIMESTAMP,
        date_created: admin.database.ServerValue.TIMESTAMP
    });
}

router.post("/", function (req, res) {

    var callback = function(message) {
        res.status(200).json(message);
    }

    //validate the form
    if (req.body.plate_number != null && req.body.plate_number.length <= 15){

        let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        //check if plate number
        const sql_is_plate_no_exist = "SELECT `id` FROM `bus_info` WHERE plate_number = ?";
        db.connection.query(sql_is_plate_no_exist, [req.body.plate_number], function (err, result) {
            if (err) {
                console.log(err.stack)
                message.push({"status": "error_searching_plate_no"})
            }

            if(result.length > 0){
                message.push({"status": "plate_number_exist"});
            }else{
                const sql = "INSERT INTO `bus_info`(`id`, `plate_number`, `passengers`, `driver_name`, `conductor`, `end_location`, `time_stamp`) VALUES (0, ? ,?, ?, ?, ?, ?)";
                db.connection.query(sql, [req.body.plate_number, req.body.passengers, req.body.driver_name, req.body.conductor, "",mysqlTimestamp], function (err, result) {
                    if (err) {
                        console.log("bus info",err.stack);
                    }

                    message.push({"status": "bus data inserted"});

                    //insert into location table
                    const sql_location = "INSERT INTO `location_info`(`location_id`, `plate_number`, `speed`, `latitude`, `longitude`,`tickets`, `time_stamp`) VALUES (0,?,?,?,?,?,?)";
                    db.connection.query(sql_location, [req.body.plate_number, req.body.speed, req.body.latitude, req.body.longitude,0,mysqlTimestamp], function (err, result) {
                        if (err) {
                            message.push({"status": "location_error"})
                        }
                        message.push({"status": "location inserted"});

			//copy to firebase
                        copyToFirebase(req.body.plate_number, req.body.passengers, req.body.driver_name, req.body.conductor,  req.body.speed, req.body.latitude, req.body.longitude);
                    });
                })
            }
        })
    }else{
        message.push({"status": "plate_number must be less than or equal 15 character"});
    }

    callback(message[message.length - 1]);
});

module.exports = router;
