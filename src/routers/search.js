const Router = require("express").Router;
const sqlDB = require("../sql");

const searchRouter = new Router();

searchRouter.get("/searchCentres/search", function (req, res) {
    res.render("searchCentres/search");
});

searchRouter.post("/nameSearch", function(req, res){
    let name = req.body.nameSearch;
    let sql = `SELECT * FROM centres WHERE centreName="${name}"`;
  
    sqlDB.query(sql, (err, results, fields) => {
      if(err){
        console.log(err);
      } else if(results.length === 0) {
        res.render("searchCentre/searchNoResults");
      } else {
        let centre = {
          centreName: results[0].centreName,
          centreSize: results[0].centreSize,
          suburb: results[0].suburb,
          costPerDay: results[0].costPerDay,
          rating: results[0].rating,
          longDayCare: results[0].longDayCare,
          afterSchoolCare: results[0].afterSchoolCare,
          beforeSchoolCare: results[0].beforeSchoolCare,
          vacationCare: results[0].vacationCare,
          temporarilyClosed: results[0].temporarilyClosed
        };
        res.render("searchCentres/nameSearchResults", { foundCentre: centre });
      }
    });
  });
  
searchRouter.post("/search", function (req, res) {
    let suburb = req.body.suburb;
    let cSize = req.body.centreSize;
    let cost = req.body.maxCost;
    let rating = req.body.rating;
  
    let sql;
  
    if ((rating == "Any") & (cSize == "Any")) {
      sql = `SELECT * FROM centres WHERE suburb="${suburb}" AND costPerDay<${cost}`;
    } else if (rating == "Any") {
      sql = `SELECT * FROM centres WHERE suburb="${suburb}" AND costPerDay<${cost} AND centreSize=${cSize}`;
    } else if (cSize == "Any") {
      sql = `SELECT * FROM centres WHERE suburb="${suburb}" AND costPerDay<${cost} AND rating=${rating}`;
    } else {
      sql = `SELECT * FROM centres WHERE suburb="${suburb}" AND costPerDay<${cost} AND rating=${rating} AND centreSize=${cSize}`;
    }
  
    sqlDB.query(sql, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      } else if (results.length === 0) {
        res.render("searchCentre/searchNoResults");
      } else {
        let centres = [];
        for (let i = 0; i < results.length; i++) {
          let centre = {
            centreName: results[i].centreName,
            centreSize: results[i].centreSize,
            suburb: results[i].suburb,
            costPerDay: results[i].costPerDay,
            rating: results[i].rating,
            longDayCare: results[i].longDayCare,
            afterSchoolCare: results[i].afterSchoolCare,
            beforeSchoolCare: results[i].beforeSchoolCare,
            vacationCare: results[i].vacationCare,
            temporarilyClosed: results[i].temporarilyClosed,
          };
          centres.push(centre);
        }
        res.render("searchCentres/advSearchResults", { cCCentres: centres });
      }
    });
  });

module.exports = searchRouter;

