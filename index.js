const bodyParser = require('body-parser');
const express = require('express');
// add the path module
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const http = require('http').Server(app);

//port
app.set('port', Number(process.env.PORT || 3000));

const server = app.listen(app.get('port'), function () {
    console.log('Listening on ' + app.get('port'));
});

//import the apis
const new_bus = require("./api/new_bus");
const get_all_buses = require("./api/all_buses");
const location_info = require("./api/location_info");
const login = require("./api/login");

//firing the apis
app.use("/api/new_bus", new_bus);
app.use("/api/get_all_buses", get_all_buses);
app.use("/api/update_location_info", location_info);
app.use("/api/login", login);