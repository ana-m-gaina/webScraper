import axios from "axios";

export async function fetchData(endpoint, url) {
  url = url.replace(/\/$/, "");
  console.log(url);

  try {
    const response = await axios.get(endpoint, {
      params: {
        url: url,
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
