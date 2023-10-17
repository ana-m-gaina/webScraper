const fs = require("fs");
const { fillers } = require("../dictionaries/fillers.js");
const afinn = JSON.parse(fs.readFileSync("./dictionaries/afinn.json", "utf8"));
const contractions = require("../dictionaries/contractions");
const compounded = require("../dictionaries/compounded.json");

/**
 * Dictionaries for Sentiment Analysis
 * - afinn: Dictionary containing words and their sentiment scores.
 * - contractions: Expanding contractions from "isn't" to "is not".
 * - fillers: Words that do not significantly contribute to emotion (e.g., "the," "a," "them").
 * - compounded: Word combinations (e.g., "not bad," "no fun").
 */

/**
 * Search and Replace Words in Text
 *
 * This function searches for words in the given text and replaces them based on a provided dictionary.
 *
 * @param {Object} dictionary - The dictionary of words and sentiment scores.
 * @param {string} text - The text in which to search and replace words.
 * @returns {string} The modified text after search and replace.
 */
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

/**
 * Extracts and Returns a List of Words from Text
 *
 * This function takes a text and extracts individual words as a list.
 *
 * @param {string} text - The text to be processed.
 * @returns {string[]} An array of words extracted from the text.
 */
function wordList(text) {
  text.replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/g, "");
  const words = text.split(/\s+/);
  const filteredWords = words.filter(word => word.length > 0);
  return filteredWords;
}

/**
 * Analyzes the Sentiment of the Given Text
 *
 * This function analyzes the sentiment of the given text based on predefined dictionaries.
 *
 * @param {...string} args - Text to be analyzed.
 * @returns {Object} An object containing sentiment score and label.
 */
function filter(...args) {
  let text = args.join(" ");
  text = text.replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~]/g, "");
  text = text.toLowerCase();
  let score = 0;

  searchAndReplace(contractions, text);

  for (const key in compounded) {
    if (new RegExp(key, "g").test(text)) {
      score += parseInt(compounded[key], 10);
      text = text.replace(new RegExp(key, "g"), "");
    }
  }

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

  if (score < -10) {
    sentiment = "negative";
  } else if (score > 10) {
    sentiment = "positive";
  } else {
    sentiment = "neutral";
  }

  return { score, sentiment };
}

module.exports = { wordList, filter };
