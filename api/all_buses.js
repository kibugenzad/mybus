const express = require('express');
const router = express.Router();
const randtoken = require('rand-token');
const moment = require('moment');

const db = require("../db/connection");

//get all buses
var allbuses = function (data, cb) {

    for(var i in data){
        console.log(data[i])
    }
};

module.exports.allbuses = allbuses;