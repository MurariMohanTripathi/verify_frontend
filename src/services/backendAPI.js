// VERIFY/src/services/backendAPI.js
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/news"
    : "https://verify-backend-n5pg.onrender.com/api/news";

export const getNews = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const submitNews = async (newsData) => {
  try {
    const response = await axios.post(API_URL, newsData);
    return response.data;
  } catch (error) {
    console.error("Error submitting news:", error);
    throw error;
  }
};

export const voteNews = async (id, voteType) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/vote`, { type: voteType });
    return response.data;
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
};

//  THIS IS THE NEW FUNCTION THAT MAKES THE BUTTON WORK
export const aiFactCheck = async (text) => {
  try {
    const response = await axios.post(`${API_URL}/fact-check`, { text });
    return response.data;
  } catch (error) {
    console.error("AI Fact Check Error:", error);
    throw error.response?.data?.error || "Failed to analyze the news.";
  }
};
export const chatWithNewsAI = async (originalClaim, userMessage) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { originalClaim, userMessage });
    return response.data;
  } catch (error) {
    console.error("AI Chat Error:", error);
    throw error.response?.data?.error || "Failed to send message.";
  }
};