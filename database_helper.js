const mysql = require('mysql');
const authentication = require('./config_local');

const connection = mysql.createConnection({
    host: authentication.serverName,
    user: authentication.username,
    password: authentication.password
});

module.exports = {
    addEntry: addEntry
};


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
    connection.query("USE " + authentication.databaseName, function(err, result) {
        if (err)
            throw err;
    });

    // Create our table
    const tableCreation = "CREATE TABLE IF NOT EXISTS " + authentication.projectTableName + "(" +
        "id INT AUTO_INCREMENT PRIMARY KEY," +
        "s3uuid VARCHAR(50) NOT NULL," +
        "task_type ENUM('quickpi', 'quickalgo')," +
        "title VARCHAR(255)," +
        "version VARCHAR(50)," +
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

// The insert statement with the '?' to prevent sql injections.
const insert_sql = "INSERT INTO " + authentication.projectTableName + " (s3uuid, task_type, title, version, nb_access, license, authors) VALUES ?";

/**
 * This method allow us to add a new entry to the database
 * @param json The json that the user send us
 * @param s3uuid The uuid of the exercise that is sent to s3
 */
function addEntry(json, s3uuid) {
    var toPut = [[
        s3uuid,
        'quickpi',
        json.title,
        json.PEMTaskMetaData.version,
        0,
        json.PEMTaskMetaData.license,
        json.PEMTaskMetaData.authors
    ]];
    connection.query(insert_sql, [toPut], function(err, result) {
        if (err)
            throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    })
}