const express = require('express');
const router = express.Router();
const moment = require('moment');

const db = require("../db/connection");
let message = [];


router.post("/", function (req, res) {
    const sql = "SELECT company_name FROM companies";
    db.connection.query(sql, function (err, results) {
        if (err) {
            return console.log(err.stack);
        }
	console.log(results.length)
        if (results.length > 0){
            res.status(200).json({
                "status": "success",
                "company_names": results
            });
        }else{
            res.json({"status": "notfound"})
        }
    })
});

module.exports = router;
