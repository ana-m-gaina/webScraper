import { ScrapeComponent } from "./components/ScrapeComponent";

function App() {
  const endpointsSingle = [
    "http://localhost:5000/data",
    "http://localhost:5000/data-from-script",
  ];
  const endpointsMultiple = [
    "http://localhost:5000/getAll",
    "http://localhost:5000/get-all-from-script",
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
