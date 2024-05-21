const fs = require("fs");
const path = require("path");

async function filterLenders(dob, income, pincode) {
    if (dob === undefined || income === undefined || pincode === undefined) {
        return [];
    }
    const jsonFilePath = path.join(__dirname, "masterPolicy2.json");
    const jsonData = fs.readFileSync(jsonFilePath);
    const data = JSON.parse(jsonData);
    const eligibleLenders = [
        { name: "Fibe", minAge: 19, maxAge: 55, minSalary: 15000 },
        { name: "Upwards", minAge: 21, maxAge: 55, minSalary: 18000 },
        { name: "Faircent", minAge: 25, maxAge: 55, minSalary: 25000 },
        { name: "Cashe", minAge: 18, maxAge: 60, minSalary: 25000 },
        { name: "Finnable", minAge: 18, maxAge: 60, minSalary: 15000 },
        { name: "Finzy", minAge: 18, maxAge: 60, minSalary: 15000 },
        { name: "LendingKart", minAge: 18, maxAge: 60, minSalary: 15000 },
        { name: "MoneyTap", minAge: 18, maxAge: 60, minSalary: 15000 },
        { name: "MoneyView", minAge: 18, maxAge: 60, minSalary: 15000 },
        { name: "Prefr", minAge: 22, maxAge: 55, minSalary: 15000 },
    ];

    const dob1 = new Date(dob.toString());
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dob1.getFullYear();
    console.log(age, income, pincode);
    const filteredLenders1 = eligibleLenders.filter(
        (lender) => lender.minAge <= age && lender.maxAge >= age && lender.minSalary <= income,
    );
    const filteredLenders = filteredLenders1.map((lender) => lender.name);
    const foundArrays = [];
    for (const key in data) {
        if (data[key].includes(pincode)) {
            foundArrays.push(key);
        }
    }
    if (foundArrays.length === 0) {
        return [];
    }
    const commonElements = filteredLenders.filter((element) => foundArrays.includes(element));
    return commonElements;
}

module.exports = filterLenders;
