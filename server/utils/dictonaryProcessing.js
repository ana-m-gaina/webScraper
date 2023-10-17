const fs = require("fs");
const csv = require("csvtojson");

/**
 * Read the AFINN dictionary from a JSON file.
 * @returns {Object} - AFINN dictionary object.
 */
async function readAfinnDictionary() {
  try {
    const jsonContent = fs.readFileSync("./dictionaries/afinn.json", "utf8");
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error("Error reading AFINN dictionary:", error);
    return {};
  }
}

/**
 * Read the fillers dictionary from a JSON file.
 * @returns {Object} - Fillers dictionary object.
 */
async function readFillersDictionary() {
  try {
    const jsonContent = fs.readFileSync("./dictionaries/fillers.json", "utf8");
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error("Error reading fillers dictionary:", error);
    return {};
  }
}

/**
 * Read the contractions dictionary from a JSON file.
 * @returns {Object} - Contractions dictionary object.
 */
async function readContractionsDictionary() {
  try {
    const jsonContent = fs.readFileSync(
      "./dictionaries/contractions.json",
      "utf8"
    );
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error("Error reading contractions dictionary:", error);
    return {};
  }
}

/**
 * Save the compounded dictionary after extracting words with spaces.
 * @param {Object} afinn - AFINN dictionary object.
 */
async function saveCompoundedDictionary(afinn) {
  const keysWithSpaces = {};

  Object.keys(afinn).forEach(key => {
    if (key.includes(" ")) {
      keysWithSpaces[key] = afinn[key];
      delete afinn[key];
    }
  });

  const compounded = JSON.stringify(keysWithSpaces, null, 2);
  const filePath = "./dictionaries/compounded.json";

  try {
    fs.writeFileSync(filePath, compounded);
    console.log("Compounded dictionary has been saved.");
  } catch (error) {
    console.error("Error saving compounded dictionary:", error);
  }
}

/**
 * Convert a CSV file to JSON and save it as fillers.json.
 */
async function convertCsvToJson() {
  const csvFilePath = "./dictionaries/fillers.csv";
  const jsonFilePath = "./dictionaries/fillers.json";

  try {
    const jsonArray = await csv().fromFile(csvFilePath);
    const jsonData = {};
    jsonArray.forEach(item => {
      jsonData[item.Contraction] = item.Meaning;
    });

    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
    console.log(
      "CSV file has been converted to JSON and saved as fillers.json"
    );
  } catch (error) {
    console.error("Error converting CSV to JSON: ", error);
  }
}

/**
 * Convert a CSV file to a list of words and save it as fillers.js.
 */
async function convertCsvToList() {
  const csvFilePath = "./dictionaries/fillers.csv";
  const wordList = [];

  try {
    const jsonArray = await csv().fromFile(csvFilePath);
    jsonArray.forEach(row => {
      const word = row.a.trim();
      if (word) {
        wordList.push(word);
      }
    });

    const jsFile = "wordList.js";
    fs.writeFileSync(
      "fillers.js",
      `module.exports = { fillers: [${wordList
        .map(word => `"${word}"`)
        .join(", ")}] };`
    );
    console.log(
      "CSV file has been converted to a list of words and saved as fillers.js"
    );
  } catch (error) {
    console.error("Error converting CSV to a list of words: ", error);
  }
}

/**
 * Process and convert various dictionaries.
 */
async function processDictionaries() {
  const afinn = await readAfinnDictionary();
  const fillers = await readFillersDictionary();
  const contractions = await readContractionsDictionary();

  await saveCompoundedDictionary(afinn);
  await convertCsvToJson();
  await convertCsvToList();
}

module.exports = { processDictionaries };
