const fs = require("fs");
const { fillers } = require("../dictionaries/fillers.js");
const afinn = JSON.parse(fs.readFileSync("./dictionaries/afinn.json", "utf8"));
const contractions = require("../dictionaries/contractions");
const compounded = require("../dictionaries/compounded.json");

/**
 * afinn - Dictionary containing words and their scores.
 * contractions - expanding contractions from  "isn't" to  "is not" .
 * fillers - words that do not add emotion like the, a, them etc.
 * compounded - word combinations "not bad", "no fun".
 */

// Search and replace words from the dictionary in the given text.
function searchAndReplace(dictionary, text) {
  Object.keys(dictionary).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, "g");
    const matches = text.match(regex);
    if (matches) {
      score += parseInt(dictionary[key], 10);
      for (let i = 0; i < matches.length; i++) {
        text = text.replace(regex, "");
      }
    }
  });
}

// Extracts and returns a list of words from the given text
function wordList(text) {
  text.replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/g, "");
  const words = text.split(/\s+/);
  const filteredWords = words.filter(word => word.length > 0);
  return filteredWords;
}

/**
 * Analyzes the sentiment of the given text based on predefined dictionaries.
 * @param {...string} args - Text to be analyzed.
 * @returns {Object} - Object containing sentiment score and label.
 */

function filter(...args) {
  let text = args.join(" ");
  text = text.replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/g, "");
  text = text.toLowerCase();
  let score = 0;

  searchAndReplace(contractions, text);
  searchAndReplace(compounded, text);

  const words = text.split(/\s+/);
  const filteredWords = words.filter(word => word.length > 0);
  const uniqueWords = new Set(filteredWords);
  const uniqueWordsArray = Array.from(uniqueWords);

  const filteredUniqueWords = uniqueWordsArray.filter(
    word => !fillers.includes(word)
  );

  for (const word of filteredUniqueWords) {
    if (afinn.hasOwnProperty(word)) {
      score += parseInt(afinn[word], 10);
    }
  }

  let sentiment = "";

  if (score < -5) {
    sentiment = "negative";
  } else if (score > 5) {
    sentiment = "positive";
  } else {
    sentiment = "neutral";
  }

  return { score, sentiment };
}

module.exports = { wordList, filter };
