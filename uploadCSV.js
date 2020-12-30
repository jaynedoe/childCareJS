//require packages
let mysql = require('mysql');
const fs = require("fs");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("vicCentres.csv");
let csvData = [];
let csvStream = fastcsv
    .parse()
    .on("data", function (data) {
        csvData.push(data);
    })
    .on("end", function () {

        csvData.shift();

        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'childcare'
        });

        connection.connect(function (err) {
            if (err) {
                return console.error('error:' + err.message);
            } else {
                let query =
                    "INSERT INTO centres (id, centreName, serviceType, suburb, postcode, centreSize, rating, longDayCare, kinderPartOfSchool, kinderStandalone, afterSchoolCare, beforeSchoolCare, vacationCare, temporarilyClosed, costPerDay) VALUES ?";
                connection.query(query, [csvData], (error, response) => {
                    console.log(error || response);
                });
            }
        });
    });

stream.pipe(csvStream);