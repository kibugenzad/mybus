const express = require('express');
const router = express.Router();

const db = require("../db/connection");
let message = [];

//get all buses
router.post("/", function (req, res) {
    console.log(req.body)
    const sql = "SELECT * FROM accounts WHERE transport_id = ? AND fullname = ?";
    db.connection.query(sql,[req.body.transport_id, req.body.fullname], function (err, result) {
        if (err) {
            console.log(err.stack);
            return message.push("status", "error")
        }

        console.log(result)

        if (result.length === 1){
            console.log("founds")
            message.push(
                {
                    "status": "success",
                    "user_key": result[0].user_key,
                    "fullname": result[0].fullname,
                    "email": result[0].email,
                    "profile_image": result[0].profile_image,
                });
            res.status(200).json(message);
        }else{
            message.push({"status": "Thare is not account associate to this data"})
            res.status(200).json(message);
        }
    })
});

module.exports = router;