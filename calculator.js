exports.grossTaxPayable = function(salary) {
  if (salary <= 18200) {
    return 0;
  } else if (salary <= 37000) {
    return (salary - 18200) * 0.19;
  } else if (salary <= 90000) {
    return 3572 + (salary - 37000) * 0.325;
  } else if (salary <= 180000) {
    return 20797 + (salary - 90000) * 0.37;
  } else if (salary > 180000) {
    return 54097 + (salary - 180000) * 0.45;
  } else {
    return 0;
  }
};

exports.medicareLevy = function(salary) {
  if (salary < 22399) {
    return 0;
  } else if (salary < 27997) {
    return (salary - 22399) * 0.1;
  } else {
    return salary * 0.02;
  }
}

exports.lowIncomeTaxOffset = function(salary) {
  if (salary < 18200) {
    return 0;
  } else if (salary <= 20543) {
    return (salary - 18200) * 0.19;
  } else if (salary <= 37000) {
    return 445;
  } else if (salary < 66667) {
    return 445 - (salary - 37000) * 0.015;
  } else {
    return 0;
  }
}

exports.midIncomeTaxOffset = function(salary) {
  if (salary < 37000) {
    return 255;
  } else if (salary < 48000) {
    return 255 + (salary - 37000) * 0.075;
  } else if (salary < 90000) {
    return 1080;
  } else if (salary < 126000) {
    return 1080 - (salary - 90000) * 0.03;
  } else {
    return 0;
  }
}

exports.netTaxPayable = function(salary) {
  var result =
    this.grossTaxPayable(salary) +
    this.medicareLevy(salary) -
    this.lowIncomeTaxOffset(salary) -
    this.midIncomeTaxOffset(salary);
  result = Math.round(result);
  if (result < 0) {
    return 0;
  } else return result;
}

exports.netIncomeAfterTax = function(salary) {
  return salary - this.netTaxPayable(salary);
}

exports.familyTaxBenefitA = function(p1, p2, children) {
  var s1 = Number(p1);
  var s2 = Number(p2);

  var familyIncome = s1 + s2;
  var maxRate = 4942.1;
  var supplement = 781.1;
  var supplementThreshold = 80000;
  var baseRate = 1587.5;
  var maxThreshold = 55626;
  var baseThreshold = 98988;
  var maxReduction = (familyIncome - maxThreshold) * 0.2;
  var maxReducedRate = maxRate - maxReduction;
  var baseReduction = (familyIncome - baseThreshold) * 0.3;
  var baseReducedRate = baseRate - baseReduction;
  var result;

  if (familyIncome <= maxThreshold) {
    result = children * (maxRate + supplement);
    return Math.round(result);
  } else if (familyIncome <= supplementThreshold) {
    if (maxReducedRate > baseRate) {
      result = (maxReducedRate + supplement) * children;
    } else {
      result = (baseRate + supplement) * children;
    }
    return Math.round(result);
  } else if (familyIncome <= baseThreshold) {
    result = baseRate * children;
    return Math.round(result);
  } else if (baseReducedRate > 0) {
    result = baseReducedRate * children;
    return Math.round(result);
  } else {
    return 0;
  }
}

exports.familyTaxBenefitB = function(p1Salary, p2Salary) {
  var p1 = Number(p1Salary);
  var p2 = Number(p2Salary);
  var higherIncomeEarner = 0;
  var lowerIncomeEarner = 0;
  var payment = 4201.15;
  var supplement = 379.6;
  var cutOutThresholdHigher = 100000;
  var cutOutThresholdLower = 28671;
  var phaseOutThreshold = 5767;
  var maxRate = payment + supplement;
  var result;

  if (p1 > p2) {
    higherIncomeEarner = p1;
    lowerIncomeEarner = p2;
  } else {
    higherIncomeEarner = p2;
    lowerIncomeEarner = p1;
  }

  if (
    higherIncomeEarner >= cutOutThresholdHigher ||
    lowerIncomeEarner > cutOutThresholdLower
  ) {
    return 0;
  }

  if (
    higherIncomeEarner < cutOutThresholdHigher &&
    lowerIncomeEarner <= phaseOutThreshold
  ) {
    result = Math.round(maxRate);
    return result;
  }

  if (
    higherIncomeEarner < cutOutThresholdHigher &&
    lowerIncomeEarner > phaseOutThreshold
  ) {
    result = Math.round(
      maxRate - (lowerIncomeEarner - phaseOutThreshold) * 0.2
    );
    return result;
  }
}

exports.totalCentrelink = function(p1Salary, p2Salary, children) {
  var p1 = Number(p1Salary);
  var p2 = Number(p2Salary);

  var result = this.familyTaxBenefitA(p1, p2, children) + this.familyTaxBenefitB(p1, p2);
  result = Math.round(result);
  if (result < 0) {
    return 0;
  } else return result;
}

exports.childCareExpenses = function(weeklyCost) {
  var result = weeklyCost * 52;
  result = Math.round(result);
  return result;
}

exports.childcareSubsidy = function(weeklyCost) {
  var result = this.childCareExpenses(weeklyCost) * 0.5;
  result = Math.round(result);
  return result;
}

exports.netChildCare = function(weeklyCost) {
  var result = this.childCareExpenses(weeklyCost) - this.childcareSubsidy(weeklyCost);
  result = Math.round(result);
  return result;
}

exports.netSurplusDeficit = function(p1Salary, p2Salary, weeklyCost, children) {
  var p1 = Number(p1Salary);
  var p2 = Number(p2Salary);

  var result =
    p1 +
    p2 -
    this.netTaxPayable(p1) -
    this.netTaxPayable(p2) +
    this.totalCentrelink(p1, p2, children) -
    this.netChildCare(weeklyCost);
  result = Math.round(result);
  return result;
}

exports.incomePerFortnight = function(p1Salary, p2Salary, weeklyCost, children) {
  var p1 = Number(p1Salary);
  var p2 = Number(p2Salary);

  var result = this.netSurplusDeficit(p1, p2, weeklyCost, children) / 26;
  result = Math.round(result);
  return result;
}

exports.difference = function(
  p1before,
  p2before,
  p1after,
  p2after,
  weeklyCostBefore,
  weeklyCostAfter,
  kidsBefore,
  kidsAfter
) {
  var p1before = Number(p1before);
  var p2before = Number(p2before);
  var p1after = Number(p1after);
  var p2after = Number(p2after);

  var before = this.incomePerFortnight(
    p1before,
    p2before,
    weeklyCostBefore,
    kidsBefore
  );
  var after = this.incomePerFortnight(p1after, p2after, weeklyCostAfter, kidsAfter);
  var difference = Math.round(after - before);
  return difference;
}
