# Web Scraper API Documentation
This API provides endpoints to scrape and retrieve data from web pages. 
It offers various options, including scraping data from single web pages, using custom scripts for extraction, fetching links from web pages, and collecting data from multiple linked web pages.

## Prerequisites

Before using the Web Scraper API, ensure you have the following installed:
- [Node.js](https://nodejs.org/): The API is built using Node.js.

## Setup

### Clone the Repository
Open your terminal.
Navigate to the directory where you want to store your project.
Clone your GitHub repository using the following command:

```git clone https://github.com/ana-m-gaina/webScraper.git```

### Set Up and Run the Backend Server
Navigate to the server directory:
```cd webScraper/server```

Install the server's dependencies:
```npm install```

Start the backend server:
```npm start```

### Set Up and Run the Frontend Server

Open a new terminal window.
Navigate to the client directory:

```cd webScraper/client```

Install the frontend's dependencies:
```npm install```

Start the frontend server:
```npm run dev```

Your frontend server should now be running

### Access the Application
You can access your web application in your web browser by going to http://localhost:5173 . The frontend server runs on port 3000, and it should be able to communicate with your backend server running on port 5000.


## Using the Endpoints

### Retrieve Data from a Single Web Page
Endpoint: /data
Description: Use this endpoint to scrape and retrieve data from a single web page specified by the URL.
GET ```http://localhost:5000/data?url=YOUR_WEB_PAGE_URL```

### Retrieve Data from a Single Web Page Using a Script
Endpoint: /data-from-script
Description: Use this endpoint to scrape data from a single web page based on the URL provided, utilizing a custom script for extraction.
GET ```http://localhost:5000/data-from-script?url=YOUR_WEB_PAGE_URL```

### Retrieve Links from a Web Page
Endpoint: /pages
Description: This endpoint enables you to fetch links from a specified web page.
GET ```http://localhost:5000/pages?url=YOUR_WEB_PAGE_URL```

### Retrieve Data from Multiple Web Pages
Endpoint: /getAll
Description: Use this endpoint to collect data from multiple web pages linked from the specified URL.
GET ```http://localhost:5000/getAll?url=YOUR_WEB_PAGE_URL```

### Retrieve Data from Multiple Pages Using a Script
Endpoint: /get-all-from-script
Description: Use this endpoint to collect data from multiple web pages linked from the specified URL using a custom script for extraction.
GET``` http://localhost:5000/get-all-from-script?url=YOUR_WEB_PAGE_URL```

For each endpoint, replace YOUR_WEB_PAGE_URL with the URL of the web page you want to scrape.

## Response
Each endpoint returns an object or a list of objects, and each object contains the following properties:

-id: An identifier for the content.
-title: The title of the content.
-slug: A URL-friendly version of the title.
-url: The URL where the content can be accessed.
-description: A brief description or summary of the content.
-postdate: The publication date of the content in "YYYY-MM-DD" format.
-category: The category or topic to which the content belongs.
-image: The URL or path to an image associated with the content.
-author: The name of the content's author.
-articletext: The main text or body of the content, typically containing the article's content.
-wordCount: The number of words in the article.
-sentiment: The sentiment associated with the content, which can be "positive," "negative," or "neutral."
-sentimentScore: A score indicating the sentiment of the content. It's calculated based on a predefined dictionary of words and scores ranging from -5 to +5. If the score is lower than -5, the sentiment is considered negative, if it's higher than +5, it's positive; otherwise, it's neutral.

## Using the test blog https://wsa-test.vercel.app/

Sample responses and data structure information can be found in the API documentation at:
``` http://localhost:5000/api-docs/``` 

Testing the endpoint  ```https://wsa-test.vercel.app``` 

for multiple pages and link retrieval use: 
```https://wsa-test.vercel.app``` 

for single pages use a blog post link similar to:
```https://wsa-test.vercel.app/blog/the-challenges-of-urban-living``` 
