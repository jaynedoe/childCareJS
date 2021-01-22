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

appRouter.get("/contact", function (req, res) {
  res.render("contact");
});

appRouter.get("/about", function (req, res) {
  res.render("about");
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

          console.log("user found!");
          res.render("dashboard/home", { foundUser: foundUser });
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

appRouter.get("/administration/manage", function (req, res) {
  res.render("administration/manage");
});

appRouter.get("/searchCentre/search", function (req, res) {
  res.render("searchCentre/search");
});

appRouter.post("/search", function (req, res) {
  var suburb = req.body.suburb;
  var cSize = req.body.centreSize;
  var cost = req.body.maxCost;
  var rating = req.body.rating;

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
      console.log("mysql connection successful");
      res.render("searchCentre/searchNoResults");
    } else {
      console.log("mysql connection successful");
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
      res.render("searchCentre/searchResults", { cCCentres: centres });
    }
  });
});

appRouter.post("/wizard", function (req, res) {
  //require all the input data using body parser and store in variables
  let householdType = req.body.household;
  let bKids = req.body.baseKids;
  let aKids = req.body.altKids;
  let bWeeklyCost = req.body.baseWeeklyCost;
  let aWeeklyCost = req.body.altWeeklyCost;
  let p1SalaryBase = req.body.baseParent1;
  let p1SalaryAlt = req.body.altParent1;
  let p2SalaryBase = req.body.baseParent2;
  let p2SalaryAlt = req.body.altParent2;

  if (householdType == "single") {
    p2SalaryBase = 0;
    p2SalaryAlt = 0;
  }

  //use stored inputs to perform calculations
  let grossTaxP1Base = calculator.grossTaxPayable(p1SalaryBase);
  let grossTaxP2Base = calculator.grossTaxPayable(p2SalaryBase);
  let grossTaxP1Alt = calculator.grossTaxPayable(p1SalaryAlt);
  let grossTaxP2Alt = calculator.grossTaxPayable(p2SalaryAlt);

  //medicareLevy
  let medicareP1Base = calculator.medicareLevy(p1SalaryBase);
  let medicareP2Base = calculator.medicareLevy(p2SalaryBase);
  let medicareP1Alt = calculator.medicareLevy(p1SalaryAlt);
  let medicareP2Alt = calculator.medicareLevy(p2SalaryAlt);

  //lowIncomeTaxOffset
  let lowIncomeTaxOffsetP1Base = calculator.lowIncomeTaxOffset(p1SalaryBase);
  let lowIncomeTaxOffsetP2Base = calculator.lowIncomeTaxOffset(p2SalaryBase);
  let lowIncomeTaxOffsetP1Alt = calculator.lowIncomeTaxOffset(p1SalaryAlt);
  let lowIncomeTaxOffsetP2Alt = calculator.lowIncomeTaxOffset(p2SalaryAlt);

  //midIncomeTaxOffset
  let midIncomeTaxOffsetP1Base = calculator.midIncomeTaxOffset(p1SalaryBase);
  let midIncomeTaxOffsetP2Base = calculator.midIncomeTaxOffset(p2SalaryBase);
  let midIncomeTaxOffsetP1Alt = calculator.midIncomeTaxOffset(p1SalaryAlt);
  let midIncomeTaxOffsetP2Alt = calculator.midIncomeTaxOffset(p2SalaryAlt);

  //netTaxPayable
  let netTaxPayableP1Base = calculator.netTaxPayable(p1SalaryBase);
  let netTaxPayableP2Base = calculator.netTaxPayable(p2SalaryBase);
  let netTaxPayableP1Alt = calculator.netTaxPayable(p1SalaryAlt);
  let netTaxPayableP2Alt = calculator.netTaxPayable(p2SalaryAlt);

  //netIncomeAfterTax
  let netIncomeAfterTaxP1Base = calculator.netIncomeAfterTax(p1SalaryBase);
  let netIncomeAfterTaxP2Base = calculator.netIncomeAfterTax(p2SalaryBase);
  let netIncomeAfterTaxP1Alt = calculator.netIncomeAfterTax(p1SalaryAlt);
  let netIncomeAfterTaxP2Alt = calculator.netIncomeAfterTax(p2SalaryAlt);

  //NEED TWO - BEFORE AND AFTER
  //familyTaxBenefitA
  let familyTaxBenefitABase = calculator.familyTaxBenefitA(
    p1SalaryBase,
    p2SalaryBase,
    bKids
  );
  let familyTaxBenefitAAlt = calculator.familyTaxBenefitA(
    p1SalaryAlt,
    p2SalaryAlt,
    aKids
  );

  //familyTaxBeneftB
  let familyTaxBenefitBBase = calculator.familyTaxBenefitB(
    p1SalaryBase,
    p2SalaryBase
  );
  let familyTaxBenefitBAlt = calculator.familyTaxBenefitB(
    p1SalaryAlt,
    p2SalaryAlt
  );

  //totalCentrelink
  let totalCentrelinkBase = calculator.totalCentrelink(
    p1SalaryBase,
    p2SalaryBase,
    bKids
  );
  let totalCentrelinkAlt = calculator.totalCentrelink(
    p1SalaryAlt,
    p2SalaryAlt,
    aKids
  );

  //childcareExpenses
  let childCareExpensesBase = calculator.childCareExpenses(bWeeklyCost);
  let childCareExpensesAlt = calculator.childCareExpenses(aWeeklyCost);

  //childcareSubsidy
  let childCareSubsidyBase = calculator.childcareSubsidy(bWeeklyCost);
  let childCareSubsidyAlt = calculator.childcareSubsidy(aWeeklyCost);

  //netChildCare
  let netChildCareBase = calculator.netChildCare(bWeeklyCost);
  let netChildCareAlt = calculator.netChildCare(aWeeklyCost);

  //netSurplusDeficit
  let netSurplusDeficitBase = calculator.netSurplusDeficit(
    p1SalaryBase,
    p2SalaryBase,
    bWeeklyCost,
    bKids
  );
  let netSurplusDeficitAlt = calculator.netSurplusDeficit(
    p1SalaryAlt,
    p2SalaryAlt,
    aWeeklyCost,
    aKids
  );

  let difference = calculator.difference(
    p1SalaryBase,
    p2SalaryBase,
    p1SalaryAlt,
    p2SalaryAlt,
    bWeeklyCost,
    aWeeklyCost,
    bKids,
    aKids
  );
  let baseFortnightlyIncome = calculator.incomePerFortnight(
    p1SalaryBase,
    p2SalaryBase,
    bWeeklyCost,
    bKids
  );
  let altFortnightlyIncome = calculator.incomePerFortnight(
    p1SalaryAlt,
    p2SalaryAlt,
    aWeeklyCost,
    aKids
  );

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
    res.render("wizard/wizardResultsC", {
      household: householdType,
      bKids: bKids,
      aKids: aKids,
      bWeeklyCost: bWeeklyCost,
      aWeeklyCost: aWeeklyCost,
      p1SalaryBase: p1SalaryBase,
      p1SalaryAlt: p1SalaryAlt,
      p2SalaryBase: p2SalaryBase,
      p2SalaryAlt: p2SalaryAlt,
      grossTaxP1Base: grossTaxP1Base,
      grossTaxP1Alt: grossTaxP1Alt,
      grossTaxP2Base: grossTaxP2Base,
      grossTaxP2Alt: grossTaxP2Alt,
      medicareP1Base: medicareP1Base,
      medicareP1Alt: medicareP1Alt,
      medicareP2Base: medicareP2Base,
      medicareP2Alt: medicareP2Alt,
      lowIncomeTaxOffsetP1Base: lowIncomeTaxOffsetP1Base,
      lowIncomeTaxOffsetP1Alt: lowIncomeTaxOffsetP1Alt,
      lowIncomeTaxOffsetP2Base: lowIncomeTaxOffsetP2Base,
      lowIncomeTaxOffsetP2Alt: lowIncomeTaxOffsetP2Alt,
      midIncomeTaxOffsetP1Base: midIncomeTaxOffsetP1Base,
      midIncomeTaxOffsetP1Alt: midIncomeTaxOffsetP1Alt,
      midIncomeTaxOffsetP2Base: midIncomeTaxOffsetP2Base,
      midIncomeTaxOffsetP2Alt: midIncomeTaxOffsetP2Alt,
      netTaxPayableP1Base: netTaxPayableP1Base,
      netTaxPayableP1Alt: netTaxPayableP1Alt,
      netTaxPayableP2Base: netTaxPayableP2Base,
      netTaxPayableP2Alt: netTaxPayableP2Alt,
      netIncomeAfterTaxP1Base: netIncomeAfterTaxP1Base,
      netIncomeAfterTaxP1Alt: netIncomeAfterTaxP1Alt,
      netIncomeAfterTaxP2Base: netIncomeAfterTaxP2Base,
      netIncomeAfterTaxP2Alt: netIncomeAfterTaxP2Alt,
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
