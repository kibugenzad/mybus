const express = require('express');
const router = express.Router();
const randtoken = require('rand-token');
const moment = require('moment');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

const db = require("../db/connection");

function update_db(latitude,longitude,countings,bus_key) {
    const sql_update = "UPDATE bus_map_data SET latitude = ?, longitude = ?, countings = ? WHERE bus_key = ?";
    db.connection.query(sql_update, [latitude, longitude, countings, bus_key], function (err, updated_res) {
        if (err) {
            return console.log("update", err.stack)
        }

        console.log("updated")
    })
}

//inserting new
function add_new(plate_number,fleet_number,countings,latitude,longitude,bus_key) {
    let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    const bus_key = randtoken.generate(50);
    const sql = "INSERT INTO `bus_map_data` (`id`,`bus_key`,`plate_number`,`fleet_number`,`countings`,`latitude`,`longitude`,`title`,`description`,`last_update`,`date_created`) VALUES (0, ?, ? ,?, ?, ?, ?, ?, ?)";
    db.connection.query(sql, [bus_key, plate_number, fleet_number, countings, latitude, longitude, plate_number, description, mysqlTimestamp, mysqlTimestamp], function (err, result) {
        if (err) {
            return console.log(err.stack)
        }

        console.log("inserted")
    })
}

router.post("/", function (req, res) {
    const bus_key = randtoken.generate(50);

    if (req.body.latitude !== undefined || req.body.latitude !== undefined) {
        if (req.body.plate_number !== '') {
            //save data to firebase
            if (admin.apps.length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    databaseURL: "https://mybus-191611.firebaseio.com"
                });
            }

            var mapdata_ref = admin.database().ref('mapData/' + req.body.plate_number + '/bus_key');

            mapdata_ref.on('value', function(snapshot) {
                if (snapshot.val() === ''){
                    var postData = {
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        countings: req.body.countings,
                        last_update: admin.database.ServerValue.TIMESTAMP
                    };
                    var updates = {};
                    updates['mapData/' + req.body.plate_number + snapshot.val()] = postData;
                    admin.database().ref().update(updates);

                    //update other database
                    update_db(req.body.latitude,req.body.longitude,req.body.countings,bus_key)
                }else{
                    admin.database().ref('mapData/' + req.body.plate_number).set({
                        bus_key: bus_key,
                        plate_number: req.body.plate_number,
                        fleet_number: req.body.fleet_number,
                        countings: req.body.countings,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        title: req.body.title,
                        description: req.body.description,
                        last_update: admin.database.ServerValue.TIMESTAMP,
                        date_created: admin.database.ServerValue.TIMESTAMP
                    });

                    //make copy to db
                    add_new(req.body.plate_number,req.body.fleet_number,req.body.countings,req.body.latitude,req.body.longitude,bus_key)
                }
            });
        }
    }
});

module.exports = router;