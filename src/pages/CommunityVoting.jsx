import React, { useEffect, useState } from "react";
import { getNews, voteNews } from "../services/backendAPI";

const CommunityVoting = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format date to DD/MM/YYYY HH:MM
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${d}/${m}/${y} ${h}:${min}`;
  };

  // Load news from backend
  const loadClaims = async () => {
    try {
      const res = await getNews();
      setClaims(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  // Handle vote
  const handleVote = async (id, type) => {
    try {
      await voteNews(id, type);
      loadClaims(); // refresh UI
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-300 mt-10 text-xl">
        Loading community news...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🗳 Community Voting</h1>
      <p className="text-center text-gray-400 mb-8">
        Vote on news claims submitted by the community to fight misinformation.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {claims.length === 0 ? (
          <p className="text-center text-gray-400 w-full">
            No community news submitted yet.
          </p>
        ) : (
          claims.map((claim) => (
            <div
              key={claim._id}
              className="bg-gray-800 rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h2 className="text-xl font-semibold">{claim.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Submitted by {claim.submittedBy || "Anonymous"} •{" "}
                  {formatDate(claim.createdAt)}
                </p>
              </div>

              <div className="flex justify-around mt-6">
                <button
                  onClick={() => handleVote(claim._id, "true")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                >
                  ✅ True ({claim.votes?.true || 0})
                </button>

                <button
                  onClick={() => handleVote(claim._id, "false")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                >
                  ❌ False ({claim.votes?.false || 0})
                </button>

                <button
                  onClick={() => handleVote(claim._id, "review")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl"
                >
                  ⚠ Needs Review ({claim.votes?.review || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityVoting;
