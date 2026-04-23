const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/news"
    : "https://verify-backend-n5pg.onrender.com/api/news"; // Your Render URL

export async function fetchHeadlines() {
  try {
    // Fetch from YOUR backend endpoint
    const response = await fetch(`${API_URL}/external`);
    
    if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data || []; 
  } catch (error) {
    console.error("Error fetching headlines from backend:", error);
    return [];
  }
}