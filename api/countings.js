const express = require('express');
const router = express.Router();
const moment = require('moment');
var admin = require('firebase-admin');
var midnight = "0:00:00";
var now = null;

const db = require("../db/connection");
var serviceAccount = require('./serviceAccountKey.json');
let message = [];

function updateFirebase(plate_number, countings) {
    //save data to firebase
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://mybus-191611.firebaseio.com"
        });
    }

    var mapdata_ref = admin.database().ref('mapData/').child(plate_number);
    mapdata_ref.on('value', function(snapshot) {
        var postData = {
            countings: countings
        };
        var updates = {};
        admin.database().ref('mapData/').child(plate_number).update(postData);
    });
}

function resetCountings(plate_number) {
    //check if plate number
    const sql_is_plate_no_exist = "SELECT `bus_id` FROM `bus_info` WHERE plate_number = ?";
    db.connection.query(sql_is_plate_no_exist, [plate_number], function (err, result) {
        if (err) {
            console.log("Error",err.stack);
        }

        if (result.length == 1){
            const sql_update_location = "UPDATE location_info SET countings = ? WHERE plate_number = ?";
            db.connection.query(sql_update_location,[0, plate_number], function (err, result) {
                if (err) {
                    console.log("location update",err.stack);
                }

                message.push({"status": "Countings updated "});

                //copy to firebase
                updateFirebase(plate_number, 0)
            });
        }else{
            message.push({"status": plate_number+" "+"doesn't exist"});
        }
    });
}

//get updates buses
router.put("/:plate_number", function (req, res) {

    var callback = function(message) {
        res.status(200).json(message);
    }

    //check if is midnight
    now = moment().format("h:mm:ss");

    if (now === midnight) {
        //reset
        resetCountings(req.params.plate_number);
    }else{
        //check if plate number
        const sql_is_plate_no_exist = "SELECT `bus_id` FROM `bus_info` WHERE plate_number = ?";
        db.connection.query(sql_is_plate_no_exist, [req.params.plate_number], function (err, result) {
            if (err) {
                console.log("select",err.stack);
            }

            if (result.length == 1 && req.body.countings !== undefined){
                const sql_update_location = "UPDATE location_info SET countings = ? WHERE plate_number = ?";
                db.connection.query(sql_update_location,[parseInt(req.body.countings), req.params.plate_number], function (err, result) {
                    if (err) {
                        console.log("location update",err.stack);
                    }

                    message.push({"status": "countings updated "});

                    //copy to firebase
                    updateFirebase(req.params.plate_number, parseInt(req.body.data))
                });
            }else{
                message.push({"status": req.params.plate_number+" "+"doesn't exist"});
            }

            callback(message);
        });
    }
});

module.exports = router;
