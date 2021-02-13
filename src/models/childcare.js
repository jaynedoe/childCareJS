exports.maxHours = function(hours, salary){
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
  
  exports.activityAssessedParent = (parent1Hours, parent2Hours) => {
    if(Number(parent1Hours) <= Number(parent2Hours)){
        return "Parent 1";
      } else if (Number(parent1Hours) > Number(parent2Hours)){
        return "Parent 2";
      }
   }

   