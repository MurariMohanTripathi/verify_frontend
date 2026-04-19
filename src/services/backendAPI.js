import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/news", // your backend base URL
});

// Submit News
export const submitNews = (data) => API.post("/submit", data);

// Get All News
export const getNews = () => API.get("/");

// Vote on news
export const voteNews = (id, type) =>
  API.post(`/${id}/vote`, { type });
