const express = require('express');
const router = express.Router();
const randtoken = require('rand-token');
const moment = require('moment');

const db = require("../db/connection");

//get all buses
var nearest_buses = function (data, cb) {

};

module.exports.nearest_buses = nearest_buses;