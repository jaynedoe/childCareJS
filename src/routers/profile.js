const sqlDB = require("../sql");
const Router = require("express").Router;
const dateCalc = require("../models/date");

const profileRouter = new Router();

profileRouter.get("/profile", function (req, res) {

    let sql = `SELECT * FROM userProfiles WHERE userID='${req.user.id}'`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        } 

        console.log(results[0].Child3DOB);

        res.render("profile", { 
            familyName: results[0].FamilyName,
            household: results[0].HouseholdType,
            parent1Name: results[0].Parent1Name,
            parent1Salary: new Intl.NumberFormat().format(results[0].Parent1Salary),
            parent1Hours: results[0].Parent1Hours,
            parent2Name: results[0].Parent2Name,
            parent2Salary: new Intl.NumberFormat().format(results[0].Parent2Salary),
            parent2Hours: results[0].Parent2Hours,
            child1Name: results[0].Child1Name,
            child1DOB: dateCalc.returnDateOfBirth(results[0].Child1DOB),
            child2Name: results[0].Child2Name,
            child2DOB: dateCalc.returnDateOfBirth(results[0].Child2DOB),
            child3Name: results[0].Child3Name,
            child3DOB: dateCalc.returnDateOfBirth(results[0].Child3DOB),
            child4Name: results[0].Child4Name,
            child4DOB: dateCalc.returnDateOfBirth(results[0].Child4DOB),
            child5Name: results[0].Child5Name,
            child5DOB: dateCalc.returnDateOfBirth(results[0].Child5DOB),
        });        
    });
});

profileRouter.get("/editProfile", (req, res) => {

    let sql = `SELECT * FROM userProfiles WHERE userID='${req.user.id}'`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        } 
        res.render("editProfile", { 
            familyName: results[0].FamilyName,
            household: results[0].HouseholdType,
            parent1Name: results[0].Parent1Name,
            parent1Salary: new Intl.NumberFormat().format(results[0].Parent1Salary),
            parent1Hours: results[0].Parent1Hours,
            parent2Name: results[0].Parent2Name,
            parent2Salary: new Intl.NumberFormat().format(results[0].Parent2Salary),
            parent2Hours: results[0].Parent2Hours,
            child1Name: results[0].Child1Name,
            child1DOB: dateCalc.returnDateOfBirth(results[0].Child1DOB),
            child2Name: results[0].Child2Name,
            child2DOB: dateCalc.returnDateOfBirth(results[0].Child2DOB),
            child3Name: results[0].Child3Name,
            child3DOB: dateCalc.returnDateOfBirth(results[0].Child3DOB),
            child4Name: results[0].Child4Name,
            child4DOB: dateCalc.returnDateOfBirth(results[0].Child4DOB),
            child5Name: results[0].Child5Name,
            child5DOB: dateCalc.returnDateOfBirth(results[0].Child5DOB)
        });        
    });
});

profileRouter.post("/editFamilyName", (req,res) => {
    let familyName = req.body.editFamilyName;
    console.log(`Success: family name ${familyName}`);

    let sql = `UPDATE userProfiles SET FamilyName='${familyName}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editHousehold", (req, res) => {
    let household = req.body.editHousehold;

    let sql = `UPDATE userProfiles SET HouseholdType='${household}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editParent1Name", (req, res) => {
    let parent1Name = req.body.editParent1Name;

    let sql = `UPDATE userProfiles SET Parent1Name='${parent1Name}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editParent1Salary", (req, res) => {
    let parent1Salary = req.body.editParent1Salary;

    let sql = `UPDATE userProfiles SET Parent1Salary='${parent1Salary}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editParent1Hours", (req, res) => {
    let parent1Hours = req.body.editParent1Hours;

    let sql = `UPDATE userProfiles SET Parent1Hours='${parent1Hours}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editParent2Name", (req, res) => {
    let parent2Name = req.body.editParent2Name;

    let sql = `UPDATE userProfiles SET Parent2Name='${parent2Name}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editParent2Salary", (req, res) => {
    let parent2Salary = req.body.editParent2Salary;

    let sql = `UPDATE userProfiles SET Parent2Salary='${parent2Salary}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editParent2Hours", (req, res) => {
    let parent2Hours = req.body.editParent2Hours;

    let sql = `UPDATE userProfiles SET Parent2Hours='${parent2Hours}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild1Name", (req, res) => {
    let child1Name = req.body.editChild1Name;

    let sql = `UPDATE userProfiles SET Child1Name='${child1Name}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild1DOB", (req, res) => {
    let child1DOB = req.body.editChild1DOB;

    let sql = `UPDATE userProfiles SET Child1DOB='${child1DOB}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild2Name", (req, res) => {
    let child2Name = req.body.editChild2Name;

    let sql = `UPDATE userProfiles SET Child2Name='${child2Name}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild2DOB", (req, res) => {
    let child2DOB = req.body.editChild2DOB;

    let sql = `UPDATE userProfiles SET Child2DOB='${child2DOB}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild3Name", (req, res) => {
    let child3Name = req.body.editChild3Name;

    let sql = `UPDATE userProfiles SET Child3Name='${child3Name}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild3DOB", (req, res) => {
    let child3DOB = req.body.editChild3DOB;

    let sql = `UPDATE userProfiles SET Child3DOB='${child3DOB}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild4Name", (req, res) => {
    let child4Name = req.body.editChild4Name;

    let sql = `UPDATE userProfiles SET Child4Name='${child4Name}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild4DOB", (req, res) => {
    let child4DOB = req.body.editChild4DOB;

    let sql = `UPDATE userProfiles SET Child4DOB='${child4DOB}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild5Name", (req, res) => {
    let child5Name = req.body.editChild5Name;

    let sql = `UPDATE userProfiles SET Child5Name='${child5Name}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

profileRouter.post("/editChild5DOB", (req, res) => {
    let child5DOB = req.body.editChild5DOB;

    let sql = `UPDATE userProfiles SET Child5DOB='${child5DOB}' WHERE userID='${req.user.id}';`;

    sqlDB.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
    });

    res.redirect("/editProfile");
});

module.exports = profileRouter;


