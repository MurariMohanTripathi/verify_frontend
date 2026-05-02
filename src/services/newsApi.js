const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/news"
    : "https://verify-backend-n5pg.onrender.com/api/news";

export async function fetchHeadlines() {
  try {
    const response = await fetch(`${API_BASE_URL}/headlines`);

    if (!response.ok) {
      throw new Error(`Headlines request failed with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching headlines:", error);
    return [];
  }
}
