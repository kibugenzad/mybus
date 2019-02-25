const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const db = require("../db/connection");

router.post("/", function (req, res) {
    if(req.body.email == '' || req.body.password == ''){
        return res.status(200).json({
            "status": "All fields is required"
        })
    }else{
        const sql = "SELECT user_key,password, company_name, transport_id, fullname, profile_image, email, status FROM accounts WHERE email = ?";
        db.connection.query(sql,[req.body.email], function (error,results) {
            if (error) {
                return console.log(error.stack)
            }

            if (results.length > 0) {
                let hash = bcrypt.hashSync(req.body.password, 10);
                if(bcrypt.compareSync(req.body.password, results[0].password)) {
                  
		    // Passwords match
                    return res.status(200).json({
                        "status": "confirmed",
                        "fullname": results[0].fullname,
                        "email": results[0].email,
                        "profile_image": results[0].profile_image,
                        "user_key": results[0].user_key,
                        "company_name": results[0].company_name,
                    })
                } else {
                    // Passwords don't match
                    return res.status(400).json({
                        "status": "Authentication is failed please try again"
                    });
                }
            }else{
                return res.status(400).json({
                    "status": "Authentication is failed please try again"
                })
            }
        })
    }
});

module.exports = router;
