const fetchDataService = require("../services/fetchDataService");
const puppeteer = require("puppeteer");
const { wordList, filter } = require("../utils/textProcessing");

// Extracts a top-level element enclosed in the given braces '{}', '[]', '()' from a given string.
function extractTopLevelElement(s, e) {
  let stack = "";
  let level = 0;
  let isInsideCurlyBraces = false;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === e[0]) {
      if (level === 0) {
        isInsideCurlyBraces = true;
      }
      level++;
    }

    if (isInsideCurlyBraces) {
      stack += char;
    }

    if (char === e[1]) {
      level--;

      if (level === 0) {
        isInsideCurlyBraces = false;
        break;
      }
    }
  }

  return stack;
}

//Extracts and parses a JSON object starting with '{"props":' from the input data
async function getProps(data) {
  try {
    const regex = /\{"props":/;
    const patternMatch = data.match(regex);
    const startIndex = patternMatch.index;
    const substring = data.substring(startIndex);
    const propsData = extractTopLevelElement(substring, "{}");
    const props = JSON.parse(propsData);
    return props;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Scrapes text data from a specific element on a web page using puppeteer.
async function textScraper(endpoint) {
  const browser = await puppeteer.launch({ headless: "false" });
  const page = await browser.newPage();
  await page.goto(endpoint);
  await page.waitForSelector("body");

  try {
    const result = await page.evaluate(() => {
      const parentElement = document.querySelector(
        "body > div > div > div > div :nth-child(2) > div :nth-child(3)"
      );
      if (parentElement) {
        const children = parentElement.children;
        let text = "";

        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const childText = child.textContent.trim();
          if (i > 0) {
            text += " ";
          }
          text += childText;
        }

        return text;
      } else {
        console.log("Parent element not found");
        return {};
      }
    });

    await browser.close();

    return result;
  } catch (error) {
    await browser.close();
    console.error("Error in textScraper:", error);
    return {};
  }
}

// Scrapes links from a specific element on a web page using puppeteer.
async function linkScraper(endpoint) {
  const browser = await puppeteer.launch({ headless: "false" });
  const page = await browser.newPage();
  await page.goto(endpoint);

  await page.waitForSelector("main");
  try {
    const result = await page.evaluate(() => {
      const parentElement = document.querySelector(
        "main > div > div > div:nth-child(2)"
      );
      if (parentElement) {
        const children = parentElement.children;
        const links = [];
        for (let i = 0; i < children.length; i++) {
          const link = children[i].querySelector("a");
          links.push(link.getAttribute("href"));
        }
        return { links };
      } else {
        console.log("Parent element not found");
        return { links: [] };
      }
    });
    await browser.close();
    return result;
  } catch (error) {
    console.error("Error in textScraper:", error);
    await browser.close();
    return { links: [] };
  }
}

// Finds the first "div" element.
function findFirstDiv(data) {
  const regex = /"div"/;
  const match = data.match(regex);
  const startIndex = match.index + 5;
  const substring = data.substring(startIndex - 2);
  const div = extractTopLevelElement(substring, "{}");
  return div;
}

// Finds the n-th "div" element.
function findNthElement(data, n) {
  const regex = /"div"/g;
  let matchList = [];
  let match;
  while ((match = regex.exec(data)) != null) {
    matchList.push(match.index);
  }
  const startIndex = matchList[n];
  const substring = data.substring(startIndex + 6);
  return substring;
}

// Finds the firts "children" element.
function findFirstChild(data, selector) {
  const reChidren = /children/;
  const match = data.match(reChidren);
  const startIndex = match.index;
  const substring = data.substring(startIndex);
  const child = extractTopLevelElement(substring, selector);
  return child;
}

// Looks for the first top level array element in a string and structures it .
async function expandChildren(list) {
  for (let i = 0; i < list.length; i++) {
    const children = extractTopLevelElement(list[i], "[]");
    if (children) {
      const childList = await getObjectData(children, []);
      for (let j = 0; j < childList.length; j++) {
        const childData = extractTopLevelElement(childList[j], "[]");
        const childDataChild = extractTopLevelElement(childData, "{}");
        startIndex =
          childData.indexOf(childDataChild) + childDataChild.length + 2;
        const childDataText = childData.substring(startIndex);

        const text =
          childDataChild.substring(1, childDataChild.length - 2) +
          childDataText.substring(1, childDataText.length - 2);

        list.splice(i + 1, 0, text);
      }
      list.splice(i, 1);
      i = i + childList.length;
    }
  }
  return list;
}

// Looks up the element in the list coresponding to the given slug and returns it .
function findSlugChild(data, selector) {
  const reChidren = /children/;
  const match = data.match(reChidren);
  const startIndex = match.index;
  const substring = data.substring(startIndex);
  const child = extractTopLevelElement(substring, selector);
  return child;
}

//takes a given array, looks for nested objects and destructures them.
function getObjectData(fieldData, list) {
  let startIndex = 0;
  while (startIndex < fieldData.length) {
    let objectData = extractTopLevelElement(
      fieldData.substring(startIndex),
      "{}"
    );
    if (!objectData) {
      break;
    }
    list.push(objectData.substring(1, objectData.length - 1));
    startIndex = fieldData.indexOf(objectData) + objectData.length + 2;
  }
  return list;
}

// Scrapes the script of a web page to find the text data based on the slug of the blog post.
async function scriptScraper(slug) {
  try {
    endpoint =
      "https://wsa-test.vercel.app/_next/static/chunks/pages/blog/%5Bslug%5D-a0808f892d5fd16c.js";
    const data = await fetchDataService.fetchData(endpoint);

    async function processTextData(data, slug) {
      const textData = await findNthElement(data, 7);
      const slugIndex = textData.indexOf(slug);
      const newData = textData.substring(slugIndex);
      const fieldData = await findFirstChild(newData, "[]");
      const list = await getObjectData(fieldData, []);
      const expandedList = await expandChildren(list);

      for (let i = 0; i < list.length; i++) {
        const regex = /children:/;
        const match = expandedList[i].match(regex);
        const startIndex = match.index + match[0].length + 1;
        const substring = expandedList[i].substring(
          startIndex,
          expandedList[i].length - 1
        );
        list[i] = substring;
      }

      return expandedList;
    }

    response = await processTextData(data, slug);

    const concatText = response.join(" ");
    const cleanText = concatText.replace(/"/g, "");

    return cleanText;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Scrapes the index script of a web page to find the text data based on the slug of the blog post.
async function indexScraper() {
  try {
    endpoint =
      "https://wsa-test.vercel.app/_next/static/chunks/pages/index-f116d58692ffa69b.js";
    const data = await fetchDataService.fetchData(endpoint);
    const lastIndex = data.lastIndexOf("href:");
    const newData = data.substring(lastIndex);

    const regex = /"([^"]+)"/;
    const match = newData.match(regex);

    async function getSlugs(pageData) {
      const regex = /id:\s*([^,]+),\s*title:\s*"([^"]+)"/;
      const patternMatch = pageData.match(regex);

      if (patternMatch) {
        const startIndex = patternMatch.index - 2;
        console.log("Match starts at index:", startIndex);
        const substring = pageData.substring(startIndex);
        const slugListData = extractTopLevelElement(substring, "[]");
        const slugRegex = /slug:\s*"([^"]+)"/g;
        let slugs = [];
        let match;

        while ((match = slugRegex.exec(slugListData)) !== null) {
          const slug = match[1];
          slugs.push(slug);
        }

        if (slugs.length > 0) {
          return slugs;
        } else {
          console.log("No slug matches found.");
        }
      } else {
        console.log("No match found.");
      }
    }

    links = await getSlugs(data);
    for (let i = 0; i < links.length; i++) {
      links[i] = match[1] + links[i];
    }

    return links;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Gets the data for a single link and returns it as an object.
async function getData(endpoint, scraperFunction) {
  try {
    const data = await fetchDataService.fetchData(endpoint);
    const propsData = await getProps(data);
    const post = await propsData.props.pageProps.post;

    let text;
    if (scraperFunction && typeof scraperFunction === "function") {
      text = await scraperFunction(post.slug);
    } else {
      text = await textScraper(endpoint);
    }

    const { score, sentiment } = filter(post.title, post.description, text);

    const props = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      url: endpoint,
      description: post.description,
      postdate: post.datetime,
      category: post.category.title,
      image: post.image.src,
      author: post.author.name,
      articletext: text,
      wordCount: wordList(text).length,
      sentiment: sentiment,
      sentimentScore: score,
    };

    return props;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Gets the data for a all the links and returns it as a list.
async function getAllAsync(links, scraperFunction) {
  try {
    const promises = links.map(link => getData(link, scraperFunction));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = {
  getProps,
  getData,
  getAllAsync,
  scriptScraper,
  indexScraper,
  scriptScraper,
  linkScraper,
};
