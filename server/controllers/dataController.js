const {
  getAllAsync,
  getData,
  indexScraper,
  scriptScraper,
  linkScraper,
} = require("../utils/dataScraping");

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Retrieve Data from a Single Web Page
 *     description: Use this endpoint to scrape and retrieve data from a single web page specified by the URL.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: The URL of the web page to be scraped.
 *     responses:
 *       '200':
 *         description: Data has been successfully retrieved from the specified web page.
 *     example:
 *       usage:
 *         summary: Usage Example
 *         value: To retrieve data from the web page at https://wsa-test.vercel.app/blog/the-disappointing-reality-of-junk-food`,
 *           make a GET request to `http://localhost:5000/data?url=https://wsa-test.vercel.app/blog/the-disappointing-reality-of-junk-food`.
 */
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

/**
 * @swagger
 * /data-from-script:
 *   get:
 *     summary: Retrieve Data from a Single Web Page Using a Script
 *     description:  Use this endpoint to scrape data from a single web page based on the URL provided, utilizing a custom script for extraction.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema: 
 *           type: string
 *         description: The URL of the web page to be scraped.
 *     responses:
 *       '200':
 *         description: Data has been successfully retrieved from the specified web page using the custom script.
 *     example:
 *       usage:
 *         summary: Usage Example
 *         value: To retrieve data from the web page at `https://wsa-test.vercel.app/blog/the-disappointing-reality-of-junk-food`
 *           using a custom script, make a GET request to `http://localhost:5000/data-from-script?url=https://wsa-test.vercel.app/blog/the-disappointing-reality-of-junk-food`.

 */
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

/**
 * @swagger
 * /pages:
 *   get:
 *     summary: Retrieve Links from a Web Page
 *     description: This endpoint enables you to fetch links from a specified web page.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: The URL of the web page to obtain links from.
 *     responses:
 *       '200':
 *         description: Links have been successfully retrieved from the specified web page.
 *     example:
 *       usage:
 *         summary: Usage Example
 *         value:  To retrieve links from the web page at `https://wsa-test.vercel.app`,
 *           make a GET request to `http://localhost:5000/pages?url=https://wsa-test.vercel.app`.
 */
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

/**
 * @swagger
 * /getAll:
 *   get:
 *     summary: Retrieve Data from Multiple Web Pages
 *     description: Use this endpoint to collect data from multiple web pages linked from the specified URL.
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: The URL of the web page to start collecting data from.
 *     responses:
 *       '200':
 *         description: Data has been successfully retrieved from multiple web pages.
 *     example:
 *       usage:
 *         summary: Usage Example
 *         value:  To collect data from multiple pages linked from `https://wsa-test.vercel.app`,
 *           make a GET request to `http://localhost:5000/getAll?url=https://wsa-test.vercel.app`.
 */
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

/**
 * @swagger
 * /get-all-from-script:
 *   get:
 *     summary: Scrape multiple pages using a script.
 *     description: Use this endpoint to collect data from multiple web pages linked from the specified URL
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: The URL of the web page to start scraping from.
 *     responses:
 *       200:
 *         description: Data retrieved successfully.
 *   example:
 *       usage:
 *         summary: Usage Example
 *         value:  To collect data from multiple pages linked from `https://wsa-test.vercel.app`,
 *           make a GET request to `http://localhost:5000/get-all-from-script?url=https://wsa-test.vercel.app`.
 */
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
