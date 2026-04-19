import React from "react";
import NewsFeed from "../components/NewsFeed";
import { useNavigate } from "react-router-dom";

export default function MyNewsPage() {
  const navigate  = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
     


      <NewsFeed />
      

    </div>
  );
}