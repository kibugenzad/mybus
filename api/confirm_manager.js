
const express = require('express');
const router = express.Router();
const moment = require('moment');
const bcrypt = require("bcrypt");
var FCM = require('fcm-push');
var serverKey = 'AAAAK2tgUI8:APA91bGjTYtOoCX6Ski4TkmEMCScpHnur4PTiQyOfipOlqqGD6uDsYCh7X830orIDzdpdolKvr7fJR7aURd7H1u8RTZlD15FpVrYE5rlM-KrbXQ6NVieSID5KVwI2SuSLE7NvmadxPui'; //put your server key here
var mfcm = new FCM(serverKey);

const db = require("../db/connection");
let message = [];

//generate random username from your fullname
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function send_notification(fcm_id,email,fullname,companyname) {
    var message = {
        to: fcm_id, // required fill with device token or topics
        collapse_key: 'green',
        data: {
            user_email: email

        },
        notification: {
            title: 'Account has been confirmed',
            body: 'Dear '+fullname+" You are now able to login.",
            companyname,
            email
        }
    };

    //callback style
    mfcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

function saveCompanyName(companyname){
    //check if company exist
    const sqlcheck = "SELECT `id`, `company_name` FROM `companies` WHERE company_name = ?";
    db.connection.query(sqlcheck, [companyname], function (err, result) {
        if (err) {
            console.log(err.stack);
        }

        if (result.length == 0){
            const sql = "INSERT INTO `companies`(`id`, `company_name`) VALUES (0,?)";
            db.connection.query(sql, [companyname], function (err, resultsql) {
                if (err) {
                    console.log(err.stack);
                }
                console.log(resultsql)
            })
        }
    })
}

router.get("/", function (req, res) {

    let date_created=moment().format('YYYY-MM-DD H:mm:ss');
    let transport_id = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    let user_key = randomString(200, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    const sql = "INSERT INTO `accounts`(`id`, `user_key`, `transport_id`, `company_name`, `fullname`, `profile_image`, `email`, `password`, `status`, `fcm`, `date_created`) VALUES (0,?,?,?,?,?,?,?,?,?,?)";
    db.connection.query(sql,[user_key,transport_id,req.query.company_name,req.query.fullname,"",req.query.email,req.query.password, "confirmed",req.query.fcm, date_created], function (err, result) {
        if (err) {
            console.log(err.stack);
            return message.push("status", "error")
        }

        //save company
        saveCompanyName(req.query.company_name);
	send_notification(req.query.fcm,req.query.email,req.query.fullname,req.query.company_name);

        res.status(200).json({
            "status": "confirmed",
            "user_key": user_key,
            "company_name": req.query.company_name,
            "fullname": req.query.fullname,
            "email": req.query.email,
            "profile_image": "",
        });
    })
});

module.exports = router;
