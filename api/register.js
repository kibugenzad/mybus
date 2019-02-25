const express = require('express');
const router = express.Router();
const moment = require('moment');
const bcrypt = require('bcrypt');

const db = require("../db/connection");
let message = [];

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

//get all buses
router.post("/", function (req, res) {
	console.log(req.body)
    //check if email is exist
    const sqlcheck = "SELECT user_key FROM accounts WHERE email = ?";
    db.connection.query(sqlcheck, [req.body.email], function (err, results) {
        if (err) {
            console.log(err.stack);
            return message.push("status", "error")
        }

        if (results.length > 0){
            res.status(200).json({
                    "status": "Account already exist, try again with an other email"
                });
        }else{
            let date_created=moment().format('YYYY-MM-DD H:mm:ss');
            let transport_id = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            let user_key = randomString(200, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

            //hash password
            let hashpassword = bcrypt.hashSync(req.body.password, 10);
            const sql = "INSERT INTO `accounts`(`id`, `user_key`, `transport_id`, `fullname`, `profile_image`, `email`, `password`, `date_created`) VALUES (0,?,?,?,?,?,?,?)";
            db.connection.query(sql,[user_key,transport_id,req.body.fullname,req.body.profile_image,req.body.email,hashpassword, date_created], function (err, result) {
                if (err) {
                    console.log(err.stack);
                    return message.push("status", "error")
                }

                res.status(200).json([{
                        "status": "success",
                        "user_key": user_key,
                        "fullname": req.body.fullname,
                        "email": req.body.email,
                        "profile_image": req.body.profile_image,
                    }]);
            })
        }
    })
});

module.exports = router;
