const sqlDB = require("../sql");
const mongoUser = require("../noSql");
const Router = require("express").Router;
const calculator = require("../models/calculator");
const passport = require("passport");

let deleteCentreId = "";
let updateCentreId = "";

const appRouter = new Router();

appRouter.get("/", function (req, res) {
  res.render("landing");
});

//AUTHENTICATION REQUIRED FOR BELOW GET ROUTES

appRouter.get("/dashboard/home", function (req, res) {
  if (req.isAuthenticated()) {
    mongoUser.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          //LOOK UP CORRESPONDING USER ID IN MYSQL AND SEND ACROSS PROFILE DATA?
          res.render("dashboard/home", { foundUser: foundUser });
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

appRouter.get("/dashboard/myAccount", function (req, res) {
  if (req.isAuthenticated()) {
    mongoUser.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          //LOOK UP CORRESPONDING USER ID IN MYSQL AND SEND ACROSS ACCOUNT DATA?
          res.render("dashboard/myAccount", { foundUser: foundUser });
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

appRouter.get("/dashboard/myScenarios", function (req, res) {
  if (req.isAuthenticated()) {
    mongoUser.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          //LOOK UP CORRESPONDING USER ID IN MYSQL AND SEND ACROSS ACCOUNT DATA?
          res.render("dashboard/myScenarios", { foundUser: foundUser });
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

appRouter.get("/dashboard/myProfile", function (req, res) {
  if (req.isAuthenticated()) {
    mongoUser.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          //LOOK UP CORRESPONDING USER ID IN MYSQL AND SEND ACROSS ACCOUNT DATA?
          res.render("dashboard/myProfile", { foundUser: foundUser });
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

appRouter.get("/wizard/wizardLanding", function (req, res) {
  if (req.isAuthenticated()) {
    mongoUser.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          res.render("wizard/wizardLanding");
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

appRouter.get("/searchCentre/search", function (req, res) {
  if (req.isAuthenticated()) {
    mongoUser.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          res.render("searchCentre/search");
        }
      }
    });
  } else {
    res.redirect("/");
  }  
});

appRouter.get("/resources", function (req, res) {
  if(req.isAuthenticated()){
    mongoUser.findById(req.user.id, function (err, foundUser){
      if(err){
        console.log(err);
      } else {
        if (foundUser) {
          res.render("resources");
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

appRouter.get("/about", function (req, res) {
  if(req.isAuthenticated()){
    mongoUser.findById(req.user.id, function (err, foundUser){
      if(err){
        console.log(err);
      } else {
        if (foundUser) {
          res.render("about");
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

appRouter.get("/profile/myProfile", function (req, res) {
  if(req.isAuthenticated()){
    mongoUser.findById(req.user.id, function (err, foundUser){
      if(err){
        console.log(err);
      } else {
        if (foundUser) {
          res.render("profile/myProfile");
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

appRouter.post("/nameSearch", function(req, res){
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
      res.render("searchCentre/nameSearchResults", { foundCentre: centre });
    }
  });
});

appRouter.post("/search", function (req, res) {
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
      res.render("searchCentre/advSearchResults", { cCCentres: centres });
    }
  });
});

appRouter.post("/wizard", function (req, res) {
  //require all the input data using body parser and store in variables
  let householdType = "couple";
  let parent1Salary1 = req.body.parent1Salary1;
  let parent1Salary2 = req.body.parent1Salary2;
  let parent1Hours1 = req.body.parent1Hours1;
  let parent1Hours2 = req.body.parent1Hours2;
  let parent2Salary1 = req.body.parent2Salary1;
  let parent2Salary2 = req.body.parent2Salary2;
  let parent2Hours1 = req.body.parent2Hours1;
  let parent2Hours2 = req.body.parent2Hours2;

  let childNames1 = req.body.childNames1;
  let centreType1 = req.body.centreType1;
  let daysInCare1 = req.body.daysInCare1;
  let dailyCost1 = req.body.dailyCost1;
  let sessionLength1 = req.body.sessionLength1;

  let childNames2 = req.body.childNames2;
  let centreType2 = req.body.centreType2;
  let daysInCare2 = req.body.daysInCare2;
  let dailyCost2 = req.body.dailyCost2;
  let sessionLength2 = req.body.sessionLength2;

  //use stored inputs to perform calculations
  let grossTaxP1Base = calculator.grossTaxPayable(parent1Salary1);
  let grossTaxP2Base = calculator.grossTaxPayable(parent2Salary1);
  let grossTaxP1Alt = calculator.grossTaxPayable(parent1Salary2);
  let grossTaxP2Alt = calculator.grossTaxPayable(parent2Salary2);

  //medicareLevy
  let medicareP1Base = calculator.medicareLevy(parent1Salary1);
  let medicareP2Base = calculator.medicareLevy(parent2Salary1);
  let medicareP1Alt = calculator.medicareLevy(parent1Salary2);
  let medicareP2Alt = calculator.medicareLevy(parent2Salary2);

  //lowIncomeTaxOffset
  let lowIncomeTaxOffsetP1Base = calculator.lowIncomeTaxOffset(parent1Salary1);
  let lowIncomeTaxOffsetP2Base = calculator.lowIncomeTaxOffset(parent2Salary1);
  let lowIncomeTaxOffsetP1Alt = calculator.lowIncomeTaxOffset(parent1Salary2);
  let lowIncomeTaxOffsetP2Alt = calculator.lowIncomeTaxOffset(parent2Salary2);

  //midIncomeTaxOffset
  let midIncomeTaxOffsetP1Base = calculator.midIncomeTaxOffset(parent1Salary1);
  let midIncomeTaxOffsetP2Base = calculator.midIncomeTaxOffset(parent2Salary1);
  let midIncomeTaxOffsetP1Alt = calculator.midIncomeTaxOffset(parent1Salary2);
  let midIncomeTaxOffsetP2Alt = calculator.midIncomeTaxOffset(parent2Salary2);

  //netTaxPayable
  let netTaxPayableP1Base = calculator.netTaxPayable(parent1Salary1);
  let netTaxPayableP2Base = calculator.netTaxPayable(parent2Salary1);
  let netTaxPayableP1Alt = calculator.netTaxPayable(parent1Salary2);
  let netTaxPayableP2Alt = calculator.netTaxPayable(parent2Salary2);

  //netIncomeAfterTax
  let netIncomeAfterTaxP1Base = calculator.netIncomeAfterTax(parent1Salary1);
  let netIncomeAfterTaxP2Base = calculator.netIncomeAfterTax(parent2Salary1);
  let netIncomeAfterTaxP1Alt = calculator.netIncomeAfterTax(parent1Salary2);
  let netIncomeAfterTaxP2Alt = calculator.netIncomeAfterTax(parent2Salary2);

  //NEED TWO - BEFORE AND AFTER
  //familyTaxBenefitA
  let familyTaxBenefitABase = calculator.familyTaxBenefitA(
    parent1Salary1,
    parent2Salary1,
    2
  );
  let familyTaxBenefitAAlt = calculator.familyTaxBenefitA(
    parent1Salary2,
    parent2Salary2,
    2
  );

  //familyTaxBeneftB
  let familyTaxBenefitBBase = calculator.familyTaxBenefitB(
    parent1Salary1,
    parent2Salary1
  );
  let familyTaxBenefitBAlt = calculator.familyTaxBenefitB(
    parent1Salary2,
    parent2Salary2
  );

  //totalCentrelink
  let totalCentrelinkBase = calculator.totalCentrelink(
    parent1Salary1,
    parent2Salary1,
    2
  );
  let totalCentrelinkAlt = calculator.totalCentrelink(
    parent1Salary2,
    parent2Salary2,
    2
  );

  //childcareExpenses
  // let childCareExpensesBase = calculator.childCareExpenses(bWeeklyCost);
  // let childCareExpensesAlt = calculator.childCareExpenses(aWeeklyCost);

  // //childcareSubsidy
  // let childCareSubsidyBase = calculator.childcareSubsidy(bWeeklyCost);
  // let childCareSubsidyAlt = calculator.childcareSubsidy(aWeeklyCost);

  // //netChildCare
  // let netChildCareBase = calculator.netChildCare(bWeeklyCost);
  // let netChildCareAlt = calculator.netChildCare(aWeeklyCost);

  // //netSurplusDeficit
  // let netSurplusDeficitBase = calculator.netSurplusDeficit(
  //   p1SalaryBase,
  //   p2SalaryBase,
  //   bWeeklyCost,
  //   bKids
  // );
  // let netSurplusDeficitAlt = calculator.netSurplusDeficit(
  //   p1SalaryAlt,
  //   p2SalaryAlt,
  //   aWeeklyCost,
  //   aKids
  // );

  // let difference = calculator.difference(
  //   p1SalaryBase,
  //   p2SalaryBase,
  //   p1SalaryAlt,
  //   p2SalaryAlt,
  //   bWeeklyCost,
  //   aWeeklyCost,
  //   bKids,
  //   aKids
  // );
  // let baseFortnightlyIncome = calculator.incomePerFortnight(
  //   p1SalaryBase,
  //   p2SalaryBase,
  //   bWeeklyCost,
  //   bKids
  // );
  // let altFortnightlyIncome = calculator.incomePerFortnight(
  //   p1SalaryAlt,
  //   p2SalaryAlt,
  //   aWeeklyCost,
  //   aKids
  // );

  if (householdType == "single") {
    res.render("wizard/wizardResultsS", {
      household: householdType,
      bKids: bKids,
      aKids: aKids,
      bWeeklyCost: bWeeklyCost,
      aWeeklyCost: aWeeklyCost,
      p1SalaryBase: p1SalaryBase,
      p1SalaryAlt: p1SalaryAlt,
      grossTaxP1Base: grossTaxP1Base,
      grossTaxP1Alt: grossTaxP1Alt,
      medicareP1Base: medicareP1Base,
      medicareP1Alt: medicareP1Alt,
      lowIncomeTaxOffsetP1Base: lowIncomeTaxOffsetP1Base,
      lowIncomeTaxOffsetP1Alt: lowIncomeTaxOffsetP1Alt,
      midIncomeTaxOffsetP1Base: midIncomeTaxOffsetP1Base,
      midIncomeTaxOffsetP1Alt: midIncomeTaxOffsetP1Alt,
      netTaxPayableP1Base: netTaxPayableP1Base,
      netTaxPayableP1Alt: netTaxPayableP1Alt,
      netIncomeAfterTaxP1Base: netIncomeAfterTaxP1Base,
      netIncomeAfterTaxP1Alt: netIncomeAfterTaxP1Alt,
      familyTaxBenefitABase: familyTaxBenefitABase,
      familyTaxBenefitAAlt: familyTaxBenefitAAlt,
      familyTaxBenefitBBase: familyTaxBenefitBBase,
      familyTaxBenefitBAlt: familyTaxBenefitBAlt,
      totalCentrelinkBase: totalCentrelinkBase,
      totalCentrelinkAlt: totalCentrelinkAlt,
      childCareExpensesBase: childCareExpensesBase,
      childCareExpensesAlt: childCareExpensesAlt,
      childCareSubsidyBase: childCareSubsidyBase,
      childCareSubsidyAlt: childCareSubsidyAlt,
      netChildCareBase: netChildCareBase,
      netChildCareAlt: netChildCareAlt,
      netSurplusDeficitBase: netSurplusDeficitBase,
      netSurplusDeficitAlt: netSurplusDeficitAlt,
      difference: difference,
      baseFortnightlyIncome: baseFortnightlyIncome,
      altFortnightlyIncome: altFortnightlyIncome,
    });
  } else {
    res.render("wizard/wizardResultsC")
    }
  });

appRouter.post("/addCentre", function (req, res) {
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

appRouter.post("/deleteCheck", function (req, res) {
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

appRouter.post("/deleteCentre", function (req, res) {
  let sql = `DELETE FROM centres WHERE id='${deleteCentreId}'`;
  sqlDB.query(sql, (err, results, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/administration/manage");
    }
  });
});

appRouter.post("/updateCheck", function (req, res) {
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

appRouter.post("/updateCentre", function (req, res) {
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

module.exports = appRouter;
