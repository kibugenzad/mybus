const express = require('express');
const router = express.Router();
const moment = require('moment');

const db = require("../db/connection");
let message = [];

var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

function updateFirebase(plate_number, latitude, longitude,passengers, conductor, driver_name,speed, message) {
    //save data to firebase
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://mybus-191611.firebaseio.com"
        });
    }

    var mapdata_ref = admin.database().ref('mapData/').child(plate_number);
    mapdata_ref.once('value', function(snapshot) {
        var postData = {
            latitude: latitude,
            longitude: longitude,
            passengers: passengers,
            conductor: conductor,
            driver_name: driver_name,
	    plate_number: plate_number,
	    speed: speed,
            last_update: admin.database.ServerValue.TIMESTAMP
        };
        var updates = {};
        // updates['mapData/' + plate_number] = postData;
        admin.database().ref('mapData/').child(plate_number).update(postData);

        message.push("updated to second database")
    });
}

//get updates buses
router.put("/:plate_number", function (req, res) {

    let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    var callback = function(message) {
        res.status(200).json(message);
    }

    //check if plate number
    const sql_is_plate_no_exist = "SELECT `id` FROM `bus_info` WHERE plate_number = ?";
    db.connection.query(sql_is_plate_no_exist, [req.params.plate_number], function (err, result) {
        if (err) {
            console.log("select",err.stack)
            message.push({"status": "error_searching_plate_no"})
        }

        if (result.length == 1){
            const sql_update_location = "UPDATE location_info SET latitude = ?, longitude = ?, speed=?, time_stamp = ? WHERE plate_number = ?";
            db.connection.query(sql_update_location,[req.body.latitude, req.body.longitude, req.body.speed, mysqlTimestamp, req.params.plate_number], function (err, result) {
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
                    }

		    //make a copy to firebase
                    updateFirebase(req.params.plate_number, req.body.latitude, req.body.longitude,req.body.passengers, req.body.conductor, req.body.driver_name,req.body.speed, message);
               	    message.push("status", "bus_info_updated")
		 });
            });
        }else{
            message.push({"status": req.params.plate_number+" "+"doesn't exist"});
        }

        callback(message[message.length - 1]);
    });
});

module.exports = router;
