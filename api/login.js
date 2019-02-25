const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const db = require("../db/connection");

router.post("/", function (req, res) {
    if(req.body.email == '' || req.body.company_name == ''|| req.body.password == '' || req.body.fullname == ''  || req.body.password == ''){
        return res.status(200).json({
            "status": "All fields is required"
        })
    }else{
        const sqlcheck = "SELECT user_key, company_name, transport_id, fullname, profile_image, email, status FROM accounts WHERE email = ? AND company_name=? AND status='confirmed'";
        db.connection.query(sqlcheck, [req.body.email, req.body.company_name], function (err, results) {
            if (err) {
                console.log(err.stack);
            }

            if (results.length == 0){
                //hashing a password
                let hashpassword = bcrypt.hashSync(req.body.password, 10);
                nodemailer.createTestAccount((err, account) => {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'didier@dataintegrated.co.ke', // generated ethereal user
                            pass: 'uwiteka123'  // generated ethereal password
                        }
                    });

                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: req.body.email, // sender address
                        to: 'didier@dataintegrated.co.ke', // list of receivers
                        subject: 'Confirm '+req.body.fullname+"'s account", // Subject line
                        html: '<div>' +
                        '<p>Dear Terry, Please confirm below information to be a manager or decline</p>' +
                        '<p>Company name: <b>'+req.body.company_name+'</b><br/></p>' +
                        '<p>Fullname: <b>'+req.body.fullname+'</b><br/></p>' +
                        '<p>Email: <b>'+req.body.email+'</b><br/></p>' +
                        '<a href="http://busmonitor.mobitill.com/api/confirm_manager?fcm='+req.body.fcm+'&&fullname='+req.body.fullname+'&&email='+req.body.email+'&&company_name='+req.body.company_name+'&&password='+hashpassword+'">Confirm</a>'+
                        '<a href="http://busmonitor.mobitill.com/api/confirm_manager?fcm='+req.body.fcm+'&&fullname='+req.body.fullname+'&&email='+req.body.email+'&&company_name='+req.body.company_name+'&&password='+req.body.password+'"</a>'

		    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        if (error){
                            return res.status(400).json({"status": "notsent"});
                        }else{
                            return res.status(200).json({"status": "success"});
                        }
                    });
                });
            }else{
                //login
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
    }
});

module.exports = router;
