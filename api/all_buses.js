const express = require('express');
const router = express.Router();
const randtoken = require('rand-token');
const moment = require('moment');

const db = require("../db/connection");

//get all buses
var allbuses = function (data, cb) {
    setInterval(function () {
        const sql = "SELECT * FROM bus_map_data";
        db.connection.query(sql, function (err, result) {
            if (err) {
                return console.log("update", err.stack)
            }

            cb(result)
        })
    }, 1000)
};

module.exports.allbuses = allbuses;