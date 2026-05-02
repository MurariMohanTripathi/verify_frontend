import React, { useEffect, useState } from "react";
import { getNews, voteNews } from "../services/backendAPI";
import { auth } from "../firebase";
import AuthModal from "../components/AuthModal";

const voteTypes = [
  { type: "true", label: "True", active: "bg-green-500 border-white", base: "bg-green-600 hover:bg-green-700 text-white" },
  { type: "false", label: "False", active: "bg-red-500 border-white", base: "bg-red-600 hover:bg-red-700 text-white" },
  { type: "review", label: "Needs Review", active: "bg-yellow-400 border-white text-black", base: "bg-yellow-500 hover:bg-yellow-600 text-black" },
];

const CommunityVoting = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [votingId, setVotingId] = useState(null);
  const [error, setError] = useState("");

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${d}/${m}/${y} ${h}:${min}`;
  };

  const loadClaims = async () => {
    try {
      setError("");
      const res = await getNews();
      setClaims(res);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Unable to load community claims right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadClaims();
  }, [user]);

  const handleVote = async (id, type) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setError("");
      setVotingId(id);
      const token = await user.getIdToken();
      const result = await voteNews(id, type, token);
      setClaims((currentClaims) =>
        currentClaims.map((claim) => (claim._id === id ? result.news : claim))
      );
    } catch (err) {
      console.error("Voting error:", err);
      setError(err.response?.data?.message || "Unable to save your vote.");
    } finally {
      setVotingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-300 mt-10 text-xl">
        Loading community news...
      </p>
    );
  }

  return (
    <div className="app-page px-4 py-8 sm:px-6 lg:py-10">
      <div className="app-shell">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="app-muted text-sm font-semibold uppercase tracking-wide">Community signal</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Community Voting</h1>
            <p className="app-muted mt-2 max-w-2xl">
              Everyone can view community claims. Log in to vote, change your vote, or tap your selected vote again to revoke it.
            </p>
          </div>
          <div className="app-panel px-4 py-3 text-sm">
            {claims.length} active {claims.length === 1 ? "claim" : "claims"}
          </div>
        </div>

      {error && (
        <p className="mx-auto mb-6 max-w-2xl rounded-lg bg-red-500/15 px-4 py-3 text-center text-sm text-red-200 border border-red-500/30">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {claims.length === 0 ? (
          <p className="text-center text-gray-400 w-full">
            No community news submitted yet.
          </p>
        ) : (
          claims.map((claim) => (
            <div
              key={claim._id}
              className="app-card flex flex-col justify-between p-5 transition hover:-translate-y-0.5"
            >
              <div>
                <h2 className="text-xl font-semibold">{claim.title}</h2>
                <p className="app-muted text-sm mt-1">
                  Submitted by {claim.submittedBy || "Anonymous"} -{" "}
                  {formatDate(claim.createdAt)}
                </p>
                {claim.moderation && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <span className="app-panel px-3 py-2">
                      Credibility {claim.moderation.credibilityScore ?? "-"}%
                    </span>
                    <span className="app-panel px-3 py-2">
                      Safety {claim.moderation.safetyScore ?? "-"}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {voteTypes.map((vote) => {
                  const isActive = claim.currentUserVote === vote.type;
                  return (
                    <button
                      key={vote.type}
                      onClick={() => handleVote(claim._id, vote.type)}
                      disabled={votingId === claim._id}
                      className={`px-4 py-2 rounded-xl transition border ${
                        isActive ? vote.active : `${vote.base} border-transparent`
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                      title={isActive ? "Click again to revoke your vote" : "Vote on this claim"}
                    >
                      {vote.label} ({claim.votes?.[vote.type] || 0})
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default CommunityVoting;
