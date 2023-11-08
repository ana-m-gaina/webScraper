import { ScrapeComponent } from "./components/ScrapeComponent";

function App() {
  const endpointsSingle = [
    "https://webscraper01-e3942cf1e1f6.herokuapp.com/data",
    "https://webscraper01-e3942cf1e1f6.herokuapp.com/data-from-script",
  ];
  const endpointsMultiple = [
    "https://webscraper01-e3942cf1e1f6.herokuapp.com/getAll",
    "https://webscraper01-e3942cf1e1f6.herokuapp.com/get-all-from-script",
  ];

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-5 sm:py-10 lg:py-20 w-full">
      <ScrapeComponent
        section={"Single Website"}
        endpoints={endpointsSingle}
        description={
          "You can choose between text scraping or script scraping, and see the data it extracts."
        }
      />
      <ScrapeComponent
        section={"Multiple Websites"}
        endpoints={endpointsMultiple}
        description={
          "Enter the home URL, and watch as all the blog posts are automatically extracted."
        }
      />
    </div>
  );
}

export default App;
