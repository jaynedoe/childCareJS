const Router = require("express").Router;
const sqlDB = require("../sql");

const adminRouter = new Router();

let deleteCentreId = "";
let updateCentreId = "";

adminRouter.post("/addCentre", function (req, res) {
    let centreName = req.body.centreName;
    let rating = req.body.rating;
    let centreType = req.body.centreType;
    let cost = req.body.maxCost;
    let size = req.body.centreSize;
    let longDC = req.body.longDayCare;
    let kSchool = req.body.kinderSchool;
    let kStandalone = req.body.kinderStandalone;
    let afterSchool = req.body.afterSchool;
    let beforeSchool = req.body.beforeSchool;
    let vacation = req.body.vacation;
    let suburb = req.body.suburb;
    let postcode = req.body.postcode;
    let changeType = "Added";
    let centre = {
      centreName: centreName,
      rating: rating,
      centreType: centreType,
      cost: cost,
      size: size,
      longDC: longDC,
      kSchool: kSchool,
      kStandalone: kStandalone,
      afterSchool: afterSchool,
      beforeSchool: beforeSchool,
      vacation: vacation,
      suburb: suburb,
      postcode: postcode,
    };
  
    let sql =
      "INSERT INTO centres (centreName, serviceType, suburb, postcode, centreSize, rating, longDayCare, kinderPartOfSchool, kinderStandalone, afterSchoolCare, beforeSchoolCare, vacationCare, costPerDay) VALUES (" +
      `'${centreName}', '${centreType}', '${suburb}', ${postcode}, '${size}', '${rating}', '${longDC}', '${kSchool}', '${kStandalone}', '${afterSchool}', '${beforeSchool}', '${vacation}', ${cost})`;
  
    sqlDB.query(sql, function (err, result) {
      if (!err) {
        console.log(result);
        res.render("/administration/manageResults", {
          centre: centre,
          changeType: changeType,
        });
      } else {
        console.log(err);
      }
    });
  });
  
  adminRouter.post("/deleteCheck", function (req, res) {
    let centreToDelete = req.body.deleteCentre;
  
    // find centre, if exists
  
    let sql = `SELECT * FROM centres WHERE centreName="${centreToDelete}"`;
    sqlDB.query(sql, (err, results, fields) => {
      if (err) {
        console.log(err);
      } else if (results.length === 0) {
        res.render("search/searchNoResults");
      } else {
        console.log(results);
        deleteCentreId = results[0].id;
        res.render("administration/deleteCheck", { centre: results });
      }
    });
  });
  
  adminRouter.post("/deleteCentre", function (req, res) {
    let sql = `DELETE FROM centres WHERE id='${deleteCentreId}'`;
    sqlDB.query(sql, (err, results, fields) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/administration/manage");
      }
    });
  });
  
  adminRouter.post("/updateCheck", function (req, res) {
    let centreToUpdate = req.body.updateCentre;
  
    //find centres if exists
  
    let sql = `SELECT * FROM centres WHERE centreName='${centreToUpdate}'`;
    sqlDB.query(sql, (err, results, fields) => {
      if (err) {
        console.log(err);
      } else if (results.length === 0) {
        res.render("search/searchNoResults");
      } else {
        console.log(results);
        updateCentreId = results[0].id;
        res.render("administration/updateCheck", { centre: results });
      }
    });
  });
  
  adminRouter.post("/updateCentre", function (req, res) {
    let centreName = req.body.centreName;
    let rating = req.body.rating;
    let centreType = req.body.centreType;
    let cost = req.body.maxCost;
    let size = req.body.centreSize;
    let longDC = req.body.longDayCare;
    let kSchool = req.body.kinderSchool;
    let kStandalone = req.body.kinderStandalone;
    let afterSchool = req.body.afterSchool;
    let beforeSchool = req.body.beforeSchool;
    let vacation = req.body.vacation;
    let suburb = req.body.suburb;
    let postcode = req.body.postcode;
  
    let sql = `UPDATE centres SET centreName='${centreName}', '${centreType}', '${suburb}', ${postcode}, '${size}', '${rating}', '${longDC}', '${kSchool}', '${kStandalone}', '${afterSchool}', '${beforeSchool}', '${vacation}', ${cost} WHERE id=${updateCentreId}`;
    sqlDB.query(sql, (err, results, fields) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/manage");
      }
    });
  });

  module.exports = adminRouter;