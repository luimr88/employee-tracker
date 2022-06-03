const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'LightsOut11!',
        database: 'election'
    },
    console.log('Connected to employee database.')
);

module.exports = db;