const sqlDB = require("../sql");
const mongoUser = require("../noSql");
const Router = require("express").Router;
const calculator = require("../models/calculator");
const authenticateMiddleware = require('./auth').authenticateMiddleware

let deleteCentreId = "";
let updateCentreId = "";

const appRouter = new Router();

appRouter.get("/", function (req, res) {
  if(req.isAuthenticated()){
    res.redirect('/dashboard/home')
  } else {
    res.redirect('/login')
  }
});

//AUTHENTICATION REQUIRED FOR BELOW GET ROUTES

//app.use('/dashboard', authenticateMiddleware, dashboardRouter)
appRouter.get("/dashboard/home", authenticateMiddleware, function (req, res) {
  res.render("dashboard/home", { foundUser: req.user });
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

  let cBDaysInCareS1C1 = req.body.cBDaysInCareS1C1; 
  let cBDailyCostS1C1 = req.body.cBDailyCostS1C1;
  let cBSessionLengthS1C1 = req.body.cBSessionLengthS1C1;
  
  let cBDaysInCareS1C2 = req.body.cBDaysInCareS1C2; 
  let cBDailyCostS1C2 = req.body.cBDailyCostS1C2;
  let cBSessionLengthS1C2 = req.body.cBSessionLengthS1C2;

  let totalCentreBasedCost1 = (cBDaysInCareS1C1 * cBDailyCostS1C1) + (cBDaysInCareS1C2 * cBDailyCostS1C2);
  let totalCentreBasedHours1 = (cBDaysInCareS1C1 * cBSessionLengthS1C1) + (cBDaysInCareS1C2 * cBDaysInCareS1C2);

  let cBDaysInCareS2C1 = req.body.cBDaysInCareS2C1; 
  let cBDailyCostS2C1 = req.body.cBDailyCostS2C1;
  let cBSessionLengthS2C1 = req.body.cBSessionLengthS2C1;

  let cBDaysInCareS2C2 = req.body.cBDaysInCareS2C2; 
  let cBDailyCostS2C2 = req.body.cBDailyCostS2C2;
  let cBSessionLengthS2C2 = req.body.cBSessionLengthS2C2;

  let totalCentreBasedCost2 = (cBDaysInCareS2C1 * cBDailyCostS2C1) + (cBDaysInCareS2C2 * cBDailyCostS2C2);
  let totalCentreBasedHours2 = (cBDaysInCareS2C1 * cBSessionLengthS2C1) + (cBDaysInCareS2C2 * cBDaysInCareS2C2);

  let fDCDaysInCareS1C1 = req.body.fDCDaysInCareS1C1;
  let fDCDailyCostS1C1 = req.body.fDCDailyCostS1C1;
  let fDCSessionLengthS1C1 = req.body.fDCSessionLengthS1C1;

  let fDCDaysInCareS1C2 = req.body.fDCDaysInCareS1C2;
  let fDCDailyCostS1C2 = req.body.fDCDailyCostS1C2;
  let fDCSessionLengthS1C2 = req.body.fDCSessionLengthS1C2;

  let totalFamilyDayCareCost1 = (fDCDaysInCareS1C1*fDCDailyCostS1C1) + (fDCDaysInCareS1C2*fDCDailyCostS1C2);
  let totalFamilyDayCareHours1 = (fDCDaysInCareS1C1 * fDCSessionLengthS1C1) + (fDCDaysInCareS1C2 * fDCSessionLengthS1C2);

  let fDCDaysInCareS2C1 = req.body.fDCDaysInCareS2C1;
  let fDCDailyCostS2C1 = req.body.fDCDailyCostS2C1;
  let fDCSessionLengthS2C1 = req.body.fDCSessionLengthS2C1;

  let fDCDaysInCareS2C2 = req.body.fDCDaysInCareS2C2;
  let fDCDailyCostS2C2 = req.body.fDCDailyCostS2C2;
  let fDCSessionLengthS2C2 = req.body.fDCSessionLengthS2C2;

  let totalFamilyDayCareCost2 = (fDCDaysInCareS2C1*fDCDailyCostS2C1) + (fDCDaysInCareS2C2*fDCDailyCostS2C2);
  let totalFamilyDayCareHours2 = (fDCDaysInCareS2C1 * fDCSessionLengthS2C1) + (fDCDaysInCareS2C2 * fDCSessionLengthS2C2);

  let oSHDaysInCareS1C1 = req.body.oSHDaysInCareS1C1;
  let oSHDailyCostS1C1 = req.body.oSHDailyCostS1C1;
  let oSHSessionLengthS1C1 = req.body.oSHSessionLengthS1C1;

  let oSHDaysInCareS1C2 = req.body.oSHDaysInCareS1C2;
  let oSHDailyCostS1C2 = req.body.oSHDailyCostS1C2;
  let oSHSessionLengthS1C2 = req.body.oSHSessionLengthS1C2;

  let totalOSHCareCost1 = (oSHDaysInCareS1C1*oSHDailyCostS1C1) + (oSHDaysInCareS1C2*oSHDailyCostS1C2);
  let totalOSHCareHours1 = (oSHDaysInCareS1C1 * oSHSessionLengthS1C1) + (oSHDaysInCareS1C2 * oSHSessionLengthS1C2);

  let oSHDaysInCareS2C1 = req.body.oSHDaysInCareS2C1;
  let oSHDailyCostS2C1 = req.body.oSHDailyCostS2C1;
  let oSHSessionLengthS2C1 = req.body.oSHSessionLengthS2C1;

  let oSHDaysInCareS2C2 = req.body.oSHDaysInCareS2C2;
  let oSHDailyCostS2C2 = req.body.oSHDailyCostS2C2;
  let oSHSessionLengthS2C2 = req.body.oSHSessionLengthS2C2;

  let totalOSHCareCost2 = (oSHDaysInCareS2C1*oSHDailyCostS2C1) + (oSHDaysInCareS2C2*oSHDailyCostS2C2);
  let totalOSHCareHours2 = (oSHDaysInCareS2C1 * oSHSessionLengthS2C1) + (oSHDaysInCareS2C2 * oSHSessionLengthS2C2);

  let totalCareCost1 = totalCentreBasedCost1 + totalFamilyDayCareCost1 + totalOSHCareCost1;
  let totalCareCost2 = totalCentreBasedCost2 + totalFamilyDayCareCost2 + totalOSHCareCost2;

  let totalCareHours1 = totalCentreBasedHours1 + totalFamilyDayCareHours1 + totalOSHCareHours1;
  let totalCareHours2 = totalCentreBasedHours2 + totalFamilyDayCareHours2 + totalOSHCareHours2;

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

  //netIncomeAfterTax - Annual Figures
  let netIncomeAfterTaxP1Base = calculator.netIncomeAfterTax(parent1Salary1);
  let netIncomeAfterTaxP2Base = calculator.netIncomeAfterTax(parent2Salary1);
  let netIncomeAfterTaxP1Alt = calculator.netIncomeAfterTax(parent1Salary2);
  let netIncomeAfterTaxP2Alt = calculator.netIncomeAfterTax(parent2Salary2);

  //netIncomeAfterTax - Fortnightly Figures
  let netIncomeAfterTaxP1BaseFN = Math.round(netIncomeAfterTaxP1Base / 26);
  let netIncomeAfterTaxP2BaseFN = Math.round(netIncomeAfterTaxP2Base / 26);
  let netIncomeAfterTaxP1AltFN = Math.round(netIncomeAfterTaxP1Alt / 26);
  let netIncomeAfterTaxP2AltFN = Math.round(netIncomeAfterTaxP2Alt / 26);

  //family income for Centrelink calculations
  let familyIncome1 = Number(parent1Salary1) + Number(parent2Salary1);
  let familyIncome2 = Number(parent1Salary2) + Number(parent2Salary2);

  //activity assessed parent
  let activityAssessedParent1;
  let activityAssessedParent2;

  if(Number(parent1Hours1) <= Number(parent2Hours1)){
    activityAssessedParent1 = "Karina";
  } else if (Number(parent1Hours1) > Number(parent2Hours1)){
    activityAssessedParent1 = "Daniel";
  }

  if(Number(parent1Hours2) <= Number(parent2Hours2)){
    activityAssessedParent2 = "Karina";
  } else if(Number(parent1Hours2) > Number(parent2Hours2)){
    activityAssessedParent2 = "Daniel";
  }

  //max hours of subsidised care

  let maxHours1;
  let maxHours2;

  if(activityAssessedParent1 === "Daniel"){
    maxHours1 = calculator.maxHours(parent2Hours1, parent2Salary1);
  } else if(activityAssessedParent1 === "Karina"){
    maxHours1 = calculator.maxHours(parent1Hours1, parent1Salary1);
  }

  if(activityAssessedParent2 === "Daniel"){
    maxHours2 = calculator.maxHours(parent2Hours2, parent2Salary2);
  } else if(activityAssessedParent2 === "Karina"){
    maxHours2 = calculator.maxHours(parent1Hours2, parent1Salary2);
  }

  //hourly rate cap - out of pocket costs

  function hourlyCapCB(dailyCost, sessionLength, days){
    if(dailyCost > 12.20){
      let difference = dailyCost - 12.20;
      return difference * sessionLength * days;
    } else return 0;
  }

  let cBS1C1OutOfPocket = hourlyCapCB(cBDailyCostS1C1, cBSessionLengthS1C1, cBDaysInCareS1C1);
  let cBS1C2OutOfPocket = hourlyCapCB(cBDailyCostS1C2, cBSessionLengthS1C2, cBDaysInCareS1C2);
  let cBS2C1OutOfPocket = hourlyCapCB(cBDailyCostS2C1, cBSessionLengthS2C1, cBDaysInCareS2C1);
  let cBS2C2OutOfPocket = hourlyCapCB(cBDailyCostS2C2, cBSessionLengthS2C2, cBDaysInCareS2C2);
 
  function hourlyCapFD(dailyCost, sessionLength, days){
    if(dailyCost > 11.30){
      let difference = dailyCost - 11.30;
      return difference * sessionLength * days;
    } else return 0;
  }

  let fBS1C1OutOfPocket = hourlyCapFD(fDCDailyCostS1C1, fDCSessionLengthS1C1, fDCDaysInCareS1C1);
  let fBS1C2OutOfPocket = hourlyCapFD(fDCDailyCostS1C2, fDCSessionLengthS1C2, fDCDaysInCareS1C2);
  let fBS2C1OutOfPocket = hourlyCapFD(fDCDailyCostS2C1, fDCSessionLengthS2C1, fDCDaysInCareS2C1);
  let fBS2C2OutOfPocket = hourlyCapFD(fDCDailyCostS2C2, fDCSessionLengthS2C2, fDCDaysInCareS2C2);

  function hourlyCapOSH(dailyCost, sessionLength, days){
    if(dailyCost > 10.67){
      let difference = dailyCost - 10.67;
      return difference * sessionLength * days;
    } else return 0;
  }

  let oSHS1C1OutOfPocket = hourlyCapOSH(oSHDailyCostS1C1, oSHSessionLengthS1C1, oSHDaysInCareS1C1);
  let oSHS1C2OutOfPocket = hourlyCapOSH(oSHDailyCostS1C2, oSHSessionLengthS1C2, oSHDaysInCareS1C2);
  let oSHS2C1OutOfPocket = hourlyCapOSH(oSHDailyCostS2C1, oSHSessionLengthS2C1, oSHDaysInCareS2C1);
  let oSHS2C2OutOfPocket = hourlyCapOSH(oSHDailyCostS2C2, oSHSessionLengthS2C2, oSHDaysInCareS2C2);

  let totalHourlyOutOfPocket1 = cBS1C1OutOfPocket + cBS1C2OutOfPocket;
  totalHourlyOutOfPocket1 += fBS1C1OutOfPocket + fBS1C2OutOfPocket;
  totalHourlyOutOfPocket1 += oSHS1C1OutOfPocket + oSHS1C2OutOfPocket;
  totalHourlyOutOfPocket1 = Math.round(totalHourlyOutOfPocket1 * 52);

  let totalHourlyOutOfPocket2 = cBS2C1OutOfPocket + cBS2C2OutOfPocket;
  totalHourlyOutOfPocket2 += fBS2C1OutOfPocket + fBS2C2OutOfPocket;
  totalHourlyOutOfPocket2 += oSHS2C1OutOfPocket + oSHS2C2OutOfPocket;
  totalHourlyOutOfPocket2 = Math.round(totalHourlyOutOfPocket2 * 52);


  //childcare subsidy percentage

  function childcareSubsidy(parent1Salary, parent2Salary){
      let familyIncome = parent1Salary + parent2Salary;

      if(familyIncome < 69390){
        return 85;
      } else if(familyIncome < 174390){
        let reduction = (familyIncome - 69390) / 3000;
        return 85 - reduction;
      } else if(familyIncome < 253680){
        return 50;
      } else if(familyIncome < 343680){
        let reduction = (familyIncome - 253679) / 3000;
        return 50 - reduction;
      } else if(familyIncome < 353680){
        return 20;
      } else return 0;
  }

  let childcareSubsidy1 = Math.round(childcareSubsidy(parent1Salary1, parent2Salary1));
  let childcareSubsidy2 = Math.round(childcareSubsidy(parent1Salary2, parent2Salary2));

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

  


// ------------- SEND RESULTS -----------------------------


  if (householdType == "single") {
    res.render("wizard/wizardResultsS", {
    });
  } else {
    res.render("wizard/wizardResultsC", {
      parent1Hours1: parent1Hours1,
      parent1Hours2: parent1Hours2,
      parent2Hours1: parent2Hours1,
      parent2Hours2: parent2Hours2,
      parent1Salary1: parent1Salary1,
      parent1Salary2: parent1Salary2,
      parent2Salary1: parent2Salary1,
      parent2Salary2: parent2Salary2,
      netTaxPayableP1Base: netTaxPayableP1Base,
      netTaxPayableP1Alt: netTaxPayableP1Alt,
      netTaxPayableP2Base: netTaxPayableP2Base,
      netTaxPayableP2Alt: netTaxPayableP2Alt,
      netIncomeAfterTaxP1BaseFN: netIncomeAfterTaxP1BaseFN,
      netIncomeAfterTaxP2BaseFN: netIncomeAfterTaxP2BaseFN,
      netIncomeAfterTaxP1AltFN: netIncomeAfterTaxP1AltFN,
      netIncomeAfterTaxP2AltFN: netIncomeAfterTaxP2AltFN,
      activityAssessedParent1: activityAssessedParent1,
      activityAssessedParent2: activityAssessedParent2,
      familyIncome1: familyIncome1,
      familyIncome2: familyIncome2,
      maxHours1: maxHours1,
      maxHours2: maxHours2,
      cBDaysInCareS1C1: cBDaysInCareS1C1,
      cBDailyCostS1C1: cBDailyCostS1C1,
      cBSessionLengthS1C1: cBSessionLengthS1C1,
      cBDaysInCareS1C2: cBDaysInCareS1C2,
      cBDailyCostS1C2: cBDailyCostS1C2,
      cBSessionLengthS1C2: cBSessionLengthS1C2,
      cBDaysInCareS2C1: cBDaysInCareS2C1,
      cBDailyCostS2C1: cBDailyCostS2C1,
      cBSessionLengthS2C1: cBSessionLengthS2C1,
      cBDaysInCareS2C2: cBDaysInCareS2C2,
      cBDailyCostS2C2: cBDailyCostS2C2,
      cBSessionLengthS2C2: cBSessionLengthS2C2,
      fDCDaysInCareS1C1: fDCDaysInCareS1C1,
      fDCDailyCostS1C1: fDCDailyCostS1C1,
      fDCSessionLengthS1C1: fDCSessionLengthS1C1,
      fDCDaysInCareS1C2: fDCDaysInCareS1C2,
      fDCDailyCostS1C2: fDCDailyCostS1C2,
      fDCSessionLengthS1C2: fDCSessionLengthS1C2,
      fDCDaysInCareS2C1: fDCDaysInCareS2C1,
      fDCDailyCostS2C1: fDCDailyCostS2C1,
      fDCSessionLengthS2C1: fDCSessionLengthS2C1,
      fDCDaysInCareS2C2: fDCDaysInCareS2C2,
      fDCDailyCostS2C2: fDCDailyCostS2C2,
      fDCSessionLengthS2C2: fDCSessionLengthS2C2,
      oSHDaysInCareS1C1: oSHDaysInCareS1C1,
      oSHDailyCostS1C1: oSHDailyCostS1C1,
      oSHSessionLengthS1C1: oSHSessionLengthS1C1,
      oSHDaysInCareS1C2: oSHDaysInCareS1C2,
      oSHDailyCostS1C2: oSHDailyCostS1C2,
      oSHSessionLengthS1C2: oSHSessionLengthS1C2,
      oSHDaysInCareS2C1: oSHDaysInCareS2C1,
      oSHDailyCostS2C1: oSHDailyCostS2C1,
      oSHSessionLengthS2C1: oSHSessionLengthS2C1,
      oSHDaysInCareS2C2: oSHDaysInCareS2C2,
      oSHDailyCostS2C2: oSHDailyCostS2C2,
      oSHSessionLengthS2C2: oSHSessionLengthS2C2,
      totalCentreBasedCost1: totalCentreBasedCost1,
      totalCentreBasedCost2: totalCentreBasedCost2,
      totalFamilyDayCareCost1: totalFamilyDayCareCost1,
      totalFamilyDayCareCost2: totalFamilyDayCareCost2,
      totalOSHCareCost1: totalOSHCareCost1,
      totalOSHCareCost2: totalOSHCareCost2,
      totalCareCost1: totalCareCost1,
      totalCareCost2: totalCareCost2,
      totalCareHours1: totalCareHours1,
      totalCareHours2: totalCareHours2,
      totalHourlyOutOfPocket1: totalHourlyOutOfPocket1,
      totalHourlyOutOfPocket2: totalHourlyOutOfPocket2,
      childcareSubsidy1: childcareSubsidy1,
      childcareSubsidy2: childcareSubsidy2,
    })
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
