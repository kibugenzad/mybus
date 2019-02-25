
const mysql = require('mysql');

// create connection for localhost

const connection = mysql.createConnection({
    host: 'localhost',
    socket: '/opt/lampp/var/mysql/mysql.sock',
    user: 'root',
    password: '@Data250',
    database: 'smart_transport'
});

connection.connect((error) => {
    if(error){
        return console.log(error.stack)
    }

    console.log("Connection is established");
});

exports.connection = connection;

// const db_config = mysql.createPool({
//     host: '192.168.64.2',
//     user: 'root',
//     password: '',
//     database: 'smart_transport',
//     multipleStatements: true
// });

// exports.connection =
//     {
//         query: function () {
//             var queryArgs = Array.prototype.slice.call(arguments),
//                 events = [],
//                 eventNameIndex = {};
//
//             db_config.getConnection(function (err, conn) {
//                 if (err) {
//                     if (eventNameIndex.error) {
//                         eventNameIndex.error();
//                     }
//                 }
//                 if (conn) {
//                     var q = conn.query.apply(conn, queryArgs);
//                     q.on('end', function () {
//                         conn.release();
//                     });
//
//                     events.forEach(function (args) {
//                         q.on.apply(q, args);
//                     });
//                 }
//             });
//
//             return {
//                 on: function (eventName, callback) {
//                     events.push(Array.prototype.slice.call(arguments));
//                     eventNameIndex[eventName] = callback;
//                     return this;
//                 }
//             };
//         }
//     };
