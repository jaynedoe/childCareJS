const Router = require("express").Router;
const calculator = require("../models/calculator");
const childcare = require("../models/childcare");
const sqlDB = require("../sql");

const wizardRouter = new Router();

wizardRouter.get("/wizard/wizardLanding", function (req, res) {

  let sql = `SELECT * FROM userProfiles WHERE userID='${req.user.id}'`;

  sqlDB.query(sql, (err, results) => {
      if(err){
          console.log(err);
      }
      
      res.render("wizard/wizardLanding", { 
          familyName: results[0].FamilyName,
          household: results[0].HouseholdType,
          parent1Name: results[0].Parent1Name,
          parent1Salary: results[0].Parent1Salary,
          parent1Hours: results[0].Parent1Hours,
          parent2Name: results[0].Parent2Name,
          parent2Salary: results[0].Parent2Salary,
          parent2Hours: results[0].Parent2Hours,
          child1Name: results[0].Child1Name,
          child1DOB: results[0].Child1DOB,
          child2Name: results[0].Child2Name,
          child2DOB: results[0].Child2DOB,
          child3Name: results[0].Child3Name,
          child3DOB: results[0].Child3DOB,
          child4Name: results[0].Child4Name,
          child4DOB: results[0].Child4DOB,
          child5Name: results[0].Child5Name,
          child5DOB: results[0].Child5DOB
      });        
  });
});

wizardRouter.post("/wizard", function (req, res) {
    //require all the input data using body parser and store in variables
    let parent1Salary1 = req.body.parent1Salary1;
    let parent1Salary2 = req.body.parent1Salary2;
    let parent1Hours1 = req.body.parent1Hours1;
    let parent1Hours2 = req.body.parent1Hours2;
    let parent2Salary1 = req.body.parent2Salary1;
    let parent2Salary2 = req.body.parent2Salary2;
    let parent2Hours1 = req.body.parent2Hours1;
    let parent2Hours2 = req.body.parent2Hours2;

    
// CENTRE BASED CARE DETAILS

    let cBDaysInCareS1C1 = req.body.cBDaysInCareS1C1; 
    let cBDailyCostS1C1 = req.body.cBDailyCostS1C1;
    let cBSessionLengthS1C1 = req.body.cBSessionLengthS1C1;
    
    let cBDaysInCareS1C2 = req.body.cBDaysInCareS1C2; 
    let cBDailyCostS1C2 = req.body.cBDailyCostS1C2;
    let cBSessionLengthS1C2 = req.body.cBSessionLengthS1C2;

    let totalCentreBasedCost1 = (cBDaysInCareS1C1 * cBDailyCostS1C1) + (cBDaysInCareS1C2 * cBDailyCostS1C2);
    let totalCentreBasedHours1 = (cBDaysInCareS1C1 * cBSessionLengthS1C1) + (cBDaysInCareS1C2 * cBSessionLengthS1C2);
  
    let cBDaysInCareS2C1 = req.body.cBDaysInCareS2C1; 
    let cBDailyCostS2C1 = req.body.cBDailyCostS2C1;
    let cBSessionLengthS2C1 = req.body.cBSessionLengthS2C1;
  
    let cBDaysInCareS2C2 = req.body.cBDaysInCareS2C2; 
    let cBDailyCostS2C2 = req.body.cBDailyCostS2C2;
    let cBSessionLengthS2C2 = req.body.cBSessionLengthS2C2;
  
    let totalCentreBasedCost2 = (cBDaysInCareS2C1 * cBDailyCostS2C1) + (cBDaysInCareS2C2 * cBDailyCostS2C2);
    let totalCentreBasedHours2 = (cBDaysInCareS2C1 * cBSessionLengthS2C1) + (cBDaysInCareS2C2 * cBSessionLengthS2C2);
  
//FAMILY DAY CARE DETAILS

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
  
// OUTSIDE SCHOOL HOURS CARE DETAILS

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
  
// TOTAL CHILDCARE COST AND HOURS

    let totalCareCost1 = totalCentreBasedCost1 + totalFamilyDayCareCost1 + totalOSHCareCost1;
    let totalCareCost2 = totalCentreBasedCost2 + totalFamilyDayCareCost2 + totalOSHCareCost2;
  
    let totalCareHours1 = totalCentreBasedHours1 + totalFamilyDayCareHours1 + totalOSHCareHours1;
    let totalCareHours2 = totalCentreBasedHours2 + totalFamilyDayCareHours2 + totalOSHCareHours2;
  
    //family income for childcare subsidy calculations
    let familyIncome1 = Number(parent1Salary1) + Number(parent2Salary1);
    let familyIncome2 = Number(parent1Salary2) + Number(parent2Salary2);

    //activity assessed parent
    let activityAssessedParentS1 = childcare.activityAssessedParent(parent1Hours1, parent2Hours1);
    let activityAssessedParentS2 = childcare.activityAssessedParent(parent1Hours2, parent2Hours2);

   //max hours of subsidised care

    let maxHoursS1;
    let maxHoursS2;

    activityAssessedParentS1 === "Parent 2" ? maxHoursS1 = childcare.maxHours(parent2Hours1, parent2Salary1) : maxHoursS1 = childcare.maxHours(parent1Hours1, parent1Salary1);
    activityAssessedParentS2 === "Parent 2" ? maxHoursS2 = childcare.maxHours(parent2Hours2, parent2Salary2) : maxHoursS2 = childcare.maxHours(parent1Hours2, parent1Salary2);

    //hourly rate cap - out of pocket costs

    let cBS1C1OutOfPocket = childcare.hourlyCapCB(cBDailyCostS1C1, cBSessionLengthS1C1, cBDaysInCareS1C1);
    let cBS1C2OutOfPocket = childcare.hourlyCapCB(cBDailyCostS1C2, cBSessionLengthS1C2, cBDaysInCareS1C2);
    let cBS2C1OutOfPocket = childcare.hourlyCapCB(cBDailyCostS2C1, cBSessionLengthS2C1, cBDaysInCareS2C1);
    let cBS2C2OutOfPocket = childcare.hourlyCapCB(cBDailyCostS2C2, cBSessionLengthS2C2, cBDaysInCareS2C2);

    let fBS1C1OutOfPocket = childcare.hourlyCapFD(fDCDailyCostS1C1, fDCSessionLengthS1C1, fDCDaysInCareS1C1);
    let fBS1C2OutOfPocket = childcare.hourlyCapFD(fDCDailyCostS1C2, fDCSessionLengthS1C2, fDCDaysInCareS1C2);
    let fBS2C1OutOfPocket = childcare.hourlyCapFD(fDCDailyCostS2C1, fDCSessionLengthS2C1, fDCDaysInCareS2C1);
    let fBS2C2OutOfPocket = childcare.hourlyCapFD(fDCDailyCostS2C2, fDCSessionLengthS2C2, fDCDaysInCareS2C2);

    let oSHS1C1OutOfPocket = childcare.hourlyCapOSH(oSHDailyCostS1C1, oSHSessionLengthS1C1, oSHDaysInCareS1C1);
    let oSHS1C2OutOfPocket = childcare.hourlyCapOSH(oSHDailyCostS1C2, oSHSessionLengthS1C2, oSHDaysInCareS1C2);
    let oSHS2C1OutOfPocket = childcare.hourlyCapOSH(oSHDailyCostS2C1, oSHSessionLengthS2C1, oSHDaysInCareS2C1);
    let oSHS2C2OutOfPocket = childcare.hourlyCapOSH(oSHDailyCostS2C2, oSHSessionLengthS2C2, oSHDaysInCareS2C2);

    let totalHourlyOutOfPocket1 = cBS1C1OutOfPocket + cBS1C2OutOfPocket;
    totalHourlyOutOfPocket1 += fBS1C1OutOfPocket + fBS1C2OutOfPocket;
    totalHourlyOutOfPocket1 += oSHS1C1OutOfPocket + oSHS1C2OutOfPocket;
    totalHourlyOutOfPocket1 = Math.round(totalHourlyOutOfPocket1);

    let totalHourlyOutOfPocket2 = cBS2C1OutOfPocket + cBS2C2OutOfPocket;
    totalHourlyOutOfPocket2 += fBS2C1OutOfPocket + fBS2C2OutOfPocket;
    totalHourlyOutOfPocket2 += oSHS2C1OutOfPocket + oSHS2C2OutOfPocket;
    totalHourlyOutOfPocket2 = Math.round(totalHourlyOutOfPocket2);

    //childcare subsidy percentage
    let childcareSubsidyPercent1 = Math.round(childcare.childcareSubsidyPercent(parent1Salary1, parent2Salary1));
    let childcareSubsidyPercent2 = Math.round(childcare.childcareSubsidyPercent(parent1Salary2, parent2Salary2));

    //weekly childcare subsidy amount
    let cCSScenario1 = childcare.cCSWeeklySubsidy(totalCareCost1, childcare.childcareSubsidyPercent(parent1Salary1, parent2Salary1));
    let cCSScenario2 = childcare.cCSWeeklySubsidy(totalCareCost2, childcare.childcareSubsidyPercent(parent1Salary2, parent2Salary2));



// TAX AND CENTRELINK

    //gross tax payable
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
  
    
  
  // ------------- SEND RESULTS -----------------------------
  
  let sql = `SELECT * FROM userProfiles WHERE userID='${req.user.id}'`;

  sqlDB.query(sql, (err, results) => {
      if(err){
          console.log(err);
      } 

      res.render("wizard/wizardResultsC", {        
        familyName: results[0].FamilyName,
        household: results[0].HouseholdType,
        parent1Name: results[0].Parent1Name,
        parent1Salary: results[0].Parent1Salary,
        parent1Hours: results[0].Parent1Hours,
        parent2Name: results[0].Parent2Name,
        parent2Salary: results[0].Parent2Salary,
        parent2Hours: results[0].Parent2Hours,
        child1Name: results[0].Child1Name,
        child1DOB: results[0].Child1DOB,
        child2Name: results[0].Child2Name,
        child2DOB: results[0].Child2DOB,
        child3Name: results[0].Child3Name,
        child3DOB: results[0].Child3DOB,
        child4Name: results[0].Child4Name,
        child4DOB: results[0].Child4DOB,
        child5Name: results[0].Child5Name,
        child5DOB: results[0].Child5DOB,
        parent1Hours1: parent1Hours1,
        parent1Hours2: parent1Hours2,
        parent2Hours1: parent2Hours1,
        parent2Hours2: parent2Hours2,
        parent1Salary1: new Intl.NumberFormat().format(parent1Salary1),
        parent1Salary2: new Intl.NumberFormat().format(parent1Salary2),
        parent2Salary1: new Intl.NumberFormat().format(parent2Salary1),
        parent2Salary2: new Intl.NumberFormat().format(parent2Salary2),
        netTaxPayableP1Base: new Intl.NumberFormat().format(netTaxPayableP1Base),
        netTaxPayableP1Alt: new Intl.NumberFormat().format(netTaxPayableP1Alt),
        netTaxPayableP2Base: new Intl.NumberFormat().format(netTaxPayableP2Base),
        netTaxPayableP2Alt: new Intl.NumberFormat().format(netTaxPayableP2Alt),
        netIncomeAfterTaxP1BaseFN: new Intl.NumberFormat().format(netIncomeAfterTaxP1BaseFN),
        netIncomeAfterTaxP2BaseFN: new Intl.NumberFormat().format(netIncomeAfterTaxP2BaseFN),
        netIncomeAfterTaxP1AltFN: new Intl.NumberFormat().format(netIncomeAfterTaxP1AltFN),
        netIncomeAfterTaxP2AltFN: new Intl.NumberFormat().format(netIncomeAfterTaxP2AltFN),
        activityAssessedParent1: activityAssessedParentS1,
        activityAssessedParent2: activityAssessedParentS2,
        familyIncome1: new Intl.NumberFormat().format(familyIncome1),
        familyIncome2: new Intl.NumberFormat().format(familyIncome2),
        maxHours1: maxHoursS1,
        maxHours2: maxHoursS2,
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
        totalCentreBasedCost1: new Intl.NumberFormat().format(totalCentreBasedCost1),
        totalCentreBasedCost2: new Intl.NumberFormat().format(totalCentreBasedCost2),
        totalFamilyDayCareCost1: new Intl.NumberFormat().format(totalFamilyDayCareCost1),
        totalFamilyDayCareCost2: new Intl.NumberFormat().format(totalFamilyDayCareCost2),
        totalOSHCareCost1: new Intl.NumberFormat().format(totalOSHCareCost1),
        totalOSHCareCost2: new Intl.NumberFormat().format(totalOSHCareCost2),
        totalCareCost1: new Intl.NumberFormat().format(totalCareCost1),
        totalCareCost2: new Intl.NumberFormat().format(totalCareCost2),
        totalCareHours1: totalCareHours1,
        totalCareHours2: totalCareHours2,
        totalHourlyOutOfPocket1: new Intl.NumberFormat().format(totalHourlyOutOfPocket1),
        totalHourlyOutOfPocket2: new Intl.NumberFormat().format(totalHourlyOutOfPocket2),
        childcareSubsidyPercent1: new Intl.NumberFormat().format(childcareSubsidyPercent1),
        childcareSubsidyPercent2: new Intl.NumberFormat().format(childcareSubsidyPercent2),
        cCSScenario1Amount: Math.round(cCSScenario1.ccAmount),
        cCSScenario1Provider: Math.round(cCSScenario1.paidToProvider),
        cCSScenario1Buffer: Math.round(cCSScenario1.buffer),
        cCSScenario2Amount: Math.round(cCSScenario2.ccAmount),
        cCSScenario2Provider: Math.round(cCSScenario2.paidToProvider),
        cCSScenario2Buffer: Math.round(cCSScenario2.buffer),
        cCSScenario1Out: Math.round(cCSScenario1.outOfPocket),
        cCSScenario2Out: Math.round(cCSScenario2.outOfPocket),
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
        netIncomeAfterTaxP2Alt: netIncomeAfterTaxP2Alt
      });
  });
});

module.exports = wizardRouter;