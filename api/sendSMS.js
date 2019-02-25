const express = require('express');
const router = express.Router();
const moment = require('moment');
var twilio = require('twilio');
var accountSid = 'ACf4f1bb54b3fdbcc70d5bf9d306a0c09e'; // Your Account SID from www.twilio.com/console
var authToken = 'cecf6a6d750b59f44fa390a864dd81ff';   // Your Auth Token from www.twilio.com/console
let numbers = ["+250787393488", "+250788309163"];

//send SMS
router.post("/", function (req, res) {
    if(req.body.plate_number != undefined || req.body.driver_name != undefined || req.body.passengers != undefined || req.body.speed != undefined){
        if(req.body.speed >= 80){
            let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

            var client = new twilio(accountSid, authToken);

            var body = "Bus plate number: "+req.body.plate_number +", "+"Driver: "+req.body.driver_name+", "+"Passengers: "+req.body.passengers+", "+"high speed: "+req.body.speed+" KM/H"

	    numbers.map(function(number){
		client.messages.create({
                	body: body,
                	to: number,  // Text this number
               	 	from: '+14437072701' // From a valid Twilio number
            	})
                .then((message) => {
                    console.log(message.sid);
                    res.status(200).json({"status": "success"});
                }).catch(err => console.error(err));
	    });
        }
    }
});

module.exports = router;
