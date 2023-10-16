import React, { useState } from "react";
import CsvDownloadButton from "react-json-to-csv";
import { ConsoleDisplay } from "./ConsoleDisplay";
import { InputComponent } from "./InputComponent";

export const ScrapeComponent = ({ section, description, endpoints }) => {
  const placeholder = {
    id: 0,
    title: "Sample Title",
    slug: "sample-title",
    url: "https://sample-url.com",
    description: "A sample description of the content.",
    postdate: "YYYY-MM-DD",
    category: "Sample Category",
    image: "/sample-image.jpg",
    author: "Sample Author",
    articletext:
      "This is a sample article text. You can replace it with your content.",
    wordCount: 0,
    sentiment: "neutral",
    sentimentScore: 0,
  };

  const [consoleData, setConsoleData] = useState(placeholder);
  const [requestTime, setRequestTime] = useState(0);

  let data;
  if (!Array.isArray(consoleData)) {
    data = [consoleData];
  } else {
    data = consoleData;
  }

  return (
    <div className="overflow-hidden py-10 w-full ">
      <div className="mx-auto  px-20">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl  mb-10">
          {section}
        </h2>
        <div className="mx-auto grid  grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
          <div className=" lg:max-w-full   flex-col justify-between">
            <p className=" text-lg leading-8 text-gray-300">{description}</p>
            <InputComponent
              title={"Text Scrape Site"}
              setConsoleData={setConsoleData}
              endpoint={endpoints[0]}
              setRequestTime={setRequestTime}
            />
            <InputComponent
              title={"Script Scrape Site"}
              setConsoleData={setConsoleData}
              endpoint={endpoints[1]}
              setRequestTime={setRequestTime}
            />
            <p className=" text-lg leading-8 text-gray-300">Download CSV</p>
            <CsvDownloadButton data={data} />
          </div>

          <ConsoleDisplay data={consoleData} requestTime={requestTime} />
        </div>
      </div>

      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};
