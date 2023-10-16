const fs = require("fs");
const jsonContent = fs.readFileSync("./dictionaries/afinn.json", "utf8");
const csv = require("csvtojson");
const csvFilePath = "./dictionaries/fillers.csv";
const jsonFilePath = "./dictionaries/fillers.json";
const afinn = JSON.parse(fs.readFileSync("./dictionaries/afinn.json", "utf8"));
const fillers = JSON.parse("./dictionaries/fillers.json");
const contractions = JSON.parse("./dictionaries/contractions.json");

const keysWithSpaces = {};

Object.keys(afinn).forEach(key => {
  if (key.includes(" ")) {
    keysWithSpaces[key] = afinn[key];
    delete afinn[key];
  }
});

const compounded = JSON.stringify(keysWithSpaces, null, 2);
const filePath = "./dictionaries/compounded.json";
fs.writeFileSync(filePath, compounded);

csvToJSON()
  .fromFile(csvFilePath)
  .then(jsonArray => {
    const jsonData = {};
    jsonArray.forEach(item => {
      jsonData[item.Contraction] = item.Meaning;
    });

    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
    console.log("CSV file has been converted to JSON and saved as output.json");
  })
  .catch(error => {
    console.error("Error converting CSV to JSON: ", error);
  });

csvList()
  .fromFile(csvFilePath)
  .then(jsonArray => {
    jsonArray.forEach(row => {
      const word = row.a.trim();
      if (word) {
        wordList.push(word);
      }
    });
    const jsFile = "wordList.js";
    fs.writeFileSync(
      "fillers.js",
      `module.exports={fillers = [${wordList
        .map(word => `"${word}"`)
        .join(", ")}]};`
    );
  })
  .catch(error => {
    console.error("Error converting CSV to a list of words: ", error);
  });
