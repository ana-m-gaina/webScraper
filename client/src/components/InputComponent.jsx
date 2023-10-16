import React, { useState } from "react";
import Loading from "react-loading";
import { fetchData } from "../services/fetchDataService";

export const InputComponent = ({
  title,
  setConsoleData,
  endpoint,
  setRequestTime,
}) => {
  const [url, setUrl] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUrlChange = event => {
    setUrl(event.target.value);
  };

  const handleScrape = async () => {
    if (url.trim() === "") {
      setNotification("You must enter a valid URL to scrape.");
    } else {
      setLoading(true);
      const startTime = performance.now();
      try {
        const newConsole = await fetchData(endpoint, url);
        setConsoleData(newConsole);
        console.log(newConsole);
        setNotification("");
      } catch (error) {
        setNotification("An error occurred while fetching data.");
      } finally {
        setLoading(false);
        const endTime = performance.now();
        setRequestTime(endTime - startTime);
      }
    }
  };
  return (
    <div className=" py-4">
      <h3 className=" leading-8 text-gray-300 py-2 text-xl font-bold">
        {title}
      </h3>
      <div className="flex max-w-full gap-x-4">
        <label htmlFor="url-address" className="sr-only">
          URL address
        </label>
        <input
          id="url-address"
          name="url"
          type="url"
          autoComplete="url"
          required
          className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          placeholder="Enter your site URL"
          value={url}
          onChange={handleUrlChange}
        />
        <button
          type="button"
          onClick={handleScrape}
          className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {loading ? (
            <Loading type="spin" color="#fff" height={24} width={24} />
          ) : (
            "Scrape"
          )}
        </button>
      </div>
      {notification && <p className="mt-2 text-red-500 ">{notification}</p>}
    </div>
  );
};
