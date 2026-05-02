// VERIFY/src/services/backendAPI.js
import axios from "axios";
import { auth } from "../firebase";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/news"
    : "https://verify-backend-n5pg.onrender.com/api/news";

export const getNews = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const submitNews = async (newsData) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(`${API_URL}/submit`, newsData, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting news:", error);
    throw error;
  }
};

export const getMyNews = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/mine`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my submissions:", error);
    throw error;
  }
};

export const voteNews = async (id, voteType, token) => {
  try {
    const authToken = token || (await getAuthToken());
    const response = await axios.post(
      `${API_URL}/${id}/vote`,
      { type: voteType },
      { headers: getAuthHeaders(authToken) }
    );
    return response.data;
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
};

const getAuthToken = async () => {
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
};

const getAuthHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

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
