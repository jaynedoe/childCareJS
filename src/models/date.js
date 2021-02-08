exports.returnDateOfBirth = (sqlDateOfBirth) => {

    if(sqlDateOfBirth === "0000-00-00"){
        return ' ';
    } else {
        let year = sqlDateOfBirth.getFullYear();
        let month = sqlDateOfBirth.getMonth();
      
        month = month + 1;
    
        let day = sqlDateOfBirth.getDate();
    
        let dOBStr = `${day}/${month}/${year}`;
    
        return dOBStr;
    }

}

