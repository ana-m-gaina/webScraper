const {
  getAllAsync,
  getData,
  indexScraper,
  scriptScraper,
  linkScraper,
} = require("../utils/dataScraping");

// Define a route handler to scrape a single web page.
async function getSinglePage(req, res) {
  const endpoint = req.query.url;
  try {
    let data = await getData(endpoint);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

// Define a route handler to scrape a single web page using a script.
async function getSinglePageFromScript(req, res) {
  const endpoint = req.query.url;
  try {
    let data = await getData(endpoint, scriptScraper);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

// Define a route handler to retrieve links on a web page.
async function getPages(req, res) {
  const endpoint = req.query.url;
  try {
    const links = await linkScraper(endpoint);
    res.json(links);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

// Define a route handler to scrape multiple pages based on links.
async function getAll(req, res) {
  const endpoint = req.query.url;
  try {
    const { links } = await linkScraper(endpoint);
    for (let i = 0; i < links.length; i++) {
      links[i] = endpoint + links[i];
    }
    const data = await getAllAsync(links);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

// Define a route handler to scrape multiple pages using a script.
async function getAllFromScript(req, res) {
  const endpoint = req.query.url;
  try {
    const links = await indexScraper(endpoint);

    for (let i = 0; i < links.length; i++) {
      links[i] = endpoint + links[i];
    }
    const data = await getAllAsync(links, scriptScraper);

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

module.exports = {
  getSinglePage,
  getPages,
  getAll,
  getSinglePageFromScript,
  getAllFromScript,
};
