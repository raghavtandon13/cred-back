const fs = require("fs");
const path = require("path");

const jsonFilePath = path.join(__dirname, "masterPolicy.json");
const jsonData = fs.readFileSync(jsonFilePath);
const data = JSON.parse(jsonData);
console.log(data, "data");
const eligibleLenders = [
  { name: "Fibe", minAge: 21, maxAge: 55, minSalary: 15000 },
  { name: "Upwards", minAge: 21, maxAge: 55, minSalary: 18000 },
  { name: "Faircent", minAge: 25, maxAge: 55, minSalary: 25000 },
  { name: "Cashe", minAge: 18, maxAge: 60, minSalary: 15000 },
  { name: "Finnable", minAge: 18, maxAge: 60, minSalary: 15000 },
  { name: "Finzy", minAge: 18, maxAge: 60, minSalary: 15000 },
  { name: "LendingKart", minAge: 18, maxAge: 60, minSalary: 15000 },
  { name: "MoneyTap", minAge: 18, maxAge: 60, minSalary: 15000 },
  { name: "MoneyView", minAge: 18, maxAge: 60, minSalary: 15000 },
  { name: "Prefr", minAge: 22, maxAge: 55, minSalary: 15000 },
];

function filterLenders(dob, income, pincode) {
  console.log(dob, income, pincode);
  const dob1 = new Date(dob.toString());
  const currentDate = new Date();
  const age = currentDate.getFullYear() - dob1.getFullYear();
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
  console.log(foundArrays, "foundArrays");
  if (foundArrays.length === 0) {
    return []
  }
  const commonElements = filteredLenders.filter((element) => foundArrays.includes(element));
  return commonElements;
}

const dob = parseInt(process.argv[2]);
const pincode = parseInt(process.argv[4]);
const income = parseInt(process.argv[3]);
const result = filterLenders(dob, income, pincode);

module.exports = filterLenders;
