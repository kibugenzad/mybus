const express = require('express');
const router = express.Router();
const randtoken = require('rand-token');
const moment = require('moment');

const db = require("../db/connection");

//get all buses
var allbuses = function (data, cb) {
    console.log(data[0])
};

exports.allbuses = allbuses;