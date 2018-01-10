const mysql = require('mysql');

// create connection for localhost
const db_config = mysql.createPool({
    host: '165.227.123.140',
    user: 'bfb88c0c77e64c',
    password: '04557e23',
    database: 'heroku_1e74818bb24eeb4',
    multipleStatements: true
});

exports.connection =
    {
        query: function () {
            var queryArgs = Array.prototype.slice.call(arguments),
                events = [],
                eventNameIndex = {};

            db_config.getConnection(function (err, conn) {
                if (err) {
                    if (eventNameIndex.error) {
                        eventNameIndex.error();
                    }
                    console.log(error)
                }
                if (conn) {
                    var q = conn.query.apply(conn, queryArgs);
                    q.on('end', function () {
                        conn.release();
                    });

                    console.log("connection ok")

                    events.forEach(function (args) {
                        q.on.apply(q, args);
                    });
                }
            });

            return {
                on: function (eventName, callback) {
                    events.push(Array.prototype.slice.call(arguments));
                    eventNameIndex[eventName] = callback;
                    return this;
                }
            };
        }
    };