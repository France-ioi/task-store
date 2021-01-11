const mysql = require('mysql');
const authentication = require('./config_local');

const connection = mysql.createConnection({
    host: authentication.serverName,
    user: authentication.username,
    password: authentication.password
});


connection.connect(function(err) {
    if (err)
        throw err;
    console.log("Connected!");
    // create database
    connection.query("CREATE DATABASE IF NOT EXISTS " + authentication.databaseName, function(err, result) {
        if (err)
            throw err;
        console.log("Database created");
    });

    // specify that we will use this database
    connection.query("use " + authentication.databaseName, function(err, result) {
        if (err)
            throw err;
    });

    // Create our table
    const tableCreation = "CREATE TABLE IF NOT EXISTS " + authentication.projectTableName + "(" +
        "id INT AUTO_INCREMENT PRIMARY KEY," +
        "s3uuid VARCHAR(50) NOT NULL," +
        "task_type ENUM('quickpi', 'quickalgo')," +
        "nb_access INT(6) UNSIGNED," +
        "license VARCHAR(50)," +
        "authors VARCHAR(255)," +
        "creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
    connection.query(tableCreation, function(err, result) {
       if (err)
           throw err;
       console.log("Table created!")
    });
})