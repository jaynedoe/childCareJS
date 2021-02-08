const Router = require("express").Router;
const calculator = require("../models/calculator");
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
      activityAssessedParent1 = "Parent 1";
    } else if (Number(parent1Hours1) > Number(parent2Hours1)){
      activityAssessedParent1 = "Parent 2";
    }
  
    if(Number(parent1Hours2) <= Number(parent2Hours2)){
      activityAssessedParent2 = "Parent 1";
    } else if(Number(parent1Hours2) > Number(parent2Hours2)){
      activityAssessedParent2 = "Parent 2";
    }
  
    //max hours of subsidised care
  
    let maxHours1;
    let maxHours2;
  
    if(activityAssessedParent1 === "Parent 2"){
      maxHours1 = calculator.maxHours(parent2Hours1, parent2Salary1);
    } else if(activityAssessedParent1 === "Parent 1"){
      maxHours1 = calculator.maxHours(parent1Hours1, parent1Salary1);
    }
  
    if(activityAssessedParent2 === "Parent 2"){
      maxHours2 = calculator.maxHours(parent2Hours2, parent2Salary2);
    } else if(activityAssessedParent2 === "Parent 1"){
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
  
  let sql = `SELECT * FROM userProfiles WHERE userID='${req.user.id}'`;

  sqlDB.query(sql, (err, results) => {
      if(err){
          console.log(err);
      } 

      console.log(new Intl.NumberFormat().format(parent1Salary1));

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
        activityAssessedParent1: activityAssessedParent1,
        activityAssessedParent2: activityAssessedParent2,
        familyIncome1: new Intl.NumberFormat().format(familyIncome1),
        familyIncome2: new Intl.NumberFormat().format(familyIncome2),
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
        childcareSubsidy1: new Intl.NumberFormat().format(childcareSubsidy1),
        childcareSubsidy2: new Intl.NumberFormat().format(childcareSubsidy2),
      });
  });
});

module.exports = wizardRouter;