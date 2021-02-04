const sqlDB = require("../sql");
const Router = require("express").Router;

const profileRouter = new Router();

profileRouter.get("/profile", function (req, res) {

    let sql = `SELECT * FROM userProfiles WHERE userID='${req.user.id}'`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        } 
        res.render("profile", { 
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

profileRouter.post("/updateProfile", (req, res) => {

    let familyName = req.body.familyName;
    let household = req.body.household;
    let parent1Name = req.body.parent1Name;
    let parent1Salary = req.body.parent1Salary;
    let parent1Hours = req.body.parent1Hours;
    let parent2Name = req.body.parent2Name;
    let parent2Salary = req.body.parent2Salary;
    let parent2Hours = req.body.parent2Hours;
    let child1Name = req.body.child1Name;
    let child1DOB = req.body.child1DOB;
    let child2Name = req.body.child2Name;
    let child2DOB = req.body.child2DOB;
    let child3Name = req.body.child3Name;
    let child3DOB = req.body.child3DOB;
    let child4Name = req.body.child4Name;
    let child4DOB = req.body.child4DOB;
    let child5Name = req.body.child5Name;
    let child5DOB = req.body.child5DOB;

    let sql = `UPDATE userProfiles SET FamilyName='${familyName}', HouseholdType='${household}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    sql = `UPDATE userProfiles SET Parent1Name='${parent1Name}', Parent1Salary=${parent1Salary}, Parent1Hours=${parent1Hours} WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    sql = `UPDATE userProfiles SET Parent2Name='${parent2Name}', Parent2Salary=${parent2Salary}, Parent2Hours=${parent2Hours} WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    // sql = `UPDATE userProfiles SET Child1Name='${child1Name}', Child1DOB=${child1DOB} WHERE userID='${req.user.id}';`;

    // sqlDB.query(sql, (err, results) => {
    //     if(err){
    //         console.log(err);
    //     }
    // });

    // sql = `UPDATE userProfiles SET Child2Name='${child2Name}', Child2DOB=${child2DOB} WHERE userID='${req.user.id}';`;

    // sqlDB.query(sql, (err, results) => {
    //     if(err){
    //         console.log(err);
    //     }
    // });

    // sql = `UPDATE userProfiles SET Child3Name='${child3Name}', Child3DOB=${child3DOB} WHERE userID='${req.user.id}';`;

    // sqlDB.query(sql, (err, results) => {
    //     if(err){
    //         console.log(err);
    //     }
    // });

    // sql = `UPDATE userProfiles SET Child4Name='${child4Name}', Child4DOB=${child4DOB} WHERE userID='${req.user.id}';`;

    // sqlDB.query(sql, (err, results) => {
    //     if(err){
    //         console.log(err);
    //     }
    // });

    // sql = `UPDATE userProfiles SET Child5Name='${child5Name}', Child5DOB=${child5DOB} WHERE userID='${req.user.id}';`;

    // sqlDB.query(sql, (err, results) => {
    //     if(err){
    //         console.log(err);
    //     }
    // });

    res.redirect("/profile");

});



module.exports = profileRouter;