const express = require('express');
const router = express.Router();
const moment = require('moment');
const shapes = [];
const db = require("../db/connection");

router.post("/", function (req, res) {
//    if (req.body.route != ''){
        const sql = "SELECT R.route_id, R.route_short_name, R.route_desc, T.trip_headsign, SP.stop_lat, SP.stop_lon, SP.stop_name FROM routes R LEFT JOIN trips T ON R.route_id = T.route_id LEFT JOIN stop_times ST ON T.trip_id = ST.trip_id LEFT JOIN stops SP ON ST.stop_id = SP.stop_id";
        db.connection.query(sql, function (err, results) {
            if (err){
                return res.status(400).json({"status": "Database query error "+err.stack});
            }

            return res.status(200).json([{"status": "success"},{"results": results}]);
        })
//    }
});

//get picked routes
router.post("/pickedRoutes", function (req, res) {
    if (req.body.route != ''){
        const sql = "SELECT R.route_id, R.route_short_name, R.route_desc, T.trip_headsign, ST.arrival_time, ST.departure_time, SP.stop_lat, SP.stop_lon, SP.stop_name FROM routes R LEFT JOIN trips T ON R.route_id = T.route_id LEFT JOIN stop_times ST ON T.trip_id = ST.trip_id LEFT JOIN stops SP ON ST.stop_id = SP.stop_id WHERE R.route_short_name = ? OR SP.stop_name = ? OR R.route_desc = ? OR T.trip_headsign = ?";
        db.connection.query(sql,[req.body.route,req.body.route,req.body.route,req.body.route], function (err, results) {
            if (err){
                return res.status(400).json({"status": "Database query error "+err.stack});
            }

           const sqlshapes = "SELECT R.route_id, R.route_short_name, R.route_desc, T.trip_headsign, S.shape_pt_lat, S.shape_pt_lon FROM routes R LEFT JOIN trips T ON R.route_id = T.route_id LEFT JOIN shapes S ON S.shape_id = T.shape_id WHERE R.route_short_name = ? OR R.route_desc = ? OR T.trip_headsign = ?";
            db.connection.query(sqlshapes, [req.body.route,req.body.route,req.body.route], function (err, shapes_results) {
                if (err){
                    return res.status(400).json({"status": "Database query error "+err.stack});
                }

                return res.status(200).json([{"status": "success", "results": results, "shapes": shapes_results}]);
            });
        })
    }else{
        res.status(400).json({"status": "Please specify your destination"})
    }
})

module.exports = router;
