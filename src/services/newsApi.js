// VERIFY/src/services/newsApi.js
export async function fetchHeadlines() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=caf7167a558542dab67164b6e72af08c`
    );
    const data = await response.json();
    // console.log("NewsAPI Response:", data); // 👀 Debug
    return data.articles || []; // ✅ Return array
  } catch (error) {
    console.error("Error fetching headlines:", error);
    return [];
  }
}
