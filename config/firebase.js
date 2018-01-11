var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mybus-191611.firebaseio.com"
});

module.exports.firebase = firebase;
