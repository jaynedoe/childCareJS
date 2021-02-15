  exports.activityAssessedParent = (parent1Hours, parent2Hours) => {
    if(Number(parent1Hours) <= Number(parent2Hours)){
        return "Parent 1";
      } else if (Number(parent1Hours) > Number(parent2Hours)){
        return "Parent 2";
      }
   }

   exports.maxHours = (hours, salary) => {
    if(hours < 8 && salary < 69390){
      return 24;
    } else if(hours < 8 && salary >= 69390){
      return 0;
    } else if(hours < 17){
      return 36;
    } else if(hours < 49){
      return 72;
    } else if(hours > 48){
      return 100;
    }
  }
     
  exports.hourlyCapCB = (dailyCost, sessionLength, days) => {
    let hourlyCost = dailyCost / sessionLength;
    
    if(hourlyCost > 12.20){
      let difference = hourlyCost - 12.20;
      return difference * sessionLength * days;
    } else return 0;
  }
  
  exports.hourlyCapFD = (dailyCost, sessionLength, days) => {
    let hourlyCost = dailyCost / sessionLength;

    if(hourlyCost > 11.30){
      let difference = hourlyCost - 11.30;
      return difference * sessionLength * days;
    } else return 0;
  }

  exports.hourlyCapOSH = (dailyCost, sessionLength, days) => {
    let hourlyCost = dailyCost / sessionLength;

    if(hourlyCost > 10.67){
      let difference = hourlyCost - 10.67;
      return difference * sessionLength * days;
    } else return 0;
  }

  exports.childcareSubsidyPercent = (parent1Salary, parent2Salary) => {
    let familyIncome = Number(parent1Salary) + Number(parent2Salary);
    console.log(familyIncome);

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

   //for a session, work out if hourly cap or hourly rate is applicable

exports.cCSHourlyCapUsed = (dailyCost, sessionLength, type, school) => {
  let hourlyCost = dailyCost/sessionLength;
  let capUsed;

  if(school === "below"){
    if(type === "centreOrOSH"){
      if(hourlyCost > 12.20){
        capUsed = 12.20;
      } else { 
        capUsed = hourlyCost; 
      }
    } else if(type === "family"){
      if(hourlyCost > 11.30){
        capUsed = 11.30;
      } else {
        capUsed = hourlyCost;
      }      
    }   
  } else if(school === "above"){
    if(type === "centreOrOSH"){
      if(hourlyCost > 10.67){
        capUsed = 10.67;
      } else { 
        capUsed = hourlyCost; 
      }
    } else if(type === "family"){
      if(hourlyCost > 11.30){
        capUsed = 11.30;
      } else {
        capUsed = hourlyCost;
      }      
    }  
  }
  return capUsed;  
}

exports.cCSWeeklySubsidy = (weeklyCost, ccPercent) => {

  let ccAmount;
  let paidToProvider;
  let buffer;
  let outOfPocket;
  ccPercent = ccPercent / 100;

  ccAmount = ccPercent * weeklyCost;
  buffer = ccAmount * 0.05;
  paidToProvider = ccAmount - buffer;
  outOfPocket = weeklyCost - paidToProvider;

  let ccWeekly = {
    weeklyCost: weeklyCost,
    ccPercent: ccPercent,
    ccAmount: ccAmount,
    paidToProvider: paidToProvider,
    buffer: buffer,
    outOfPocket: outOfPocket
  }

  return ccWeekly;

}

