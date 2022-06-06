const mysql = require('mysql2');
const figlet = require('figlet');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'LightsOut11!',
        database: 'employees'
    },
    console.log('Connected to employee database.'),
    console.log(figlet.textSync('Employee Tracker'))
);

module.exports = db;