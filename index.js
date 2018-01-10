const bodyParser = require('body-parser');
const express = require('express');
// add the path module
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const http = require('http').Server(app);

const socketIO = require('socket.io');

const randtoken = require('rand-token');
const moment = require('moment');

//port
app.set('port', Number(process.env.PORT || 3000));

const server = app.listen(app.get('port'), function () {
    console.log('Listening on ' + app.get('port'));
});

const io = socketIO(server, {pingTimeout: 30000});

app.get('/', function (req, res) {
    res.send("test");
})