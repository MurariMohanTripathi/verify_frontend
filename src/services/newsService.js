import axios from "axios";
const API_URL = "http://localhost:5000/api/news";

export const submitNews = (data) => axios.post(`${API_URL}/submit`, data);
export const getNews = () => axios.get(`${API_URL}`);
export const voteNews = (id, type) => axios.post(`${API_URL}/${id}/vote`, { type });
