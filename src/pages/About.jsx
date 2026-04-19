import React from "react";
import Footer from "../components/Footer";
const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-12 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6 text-center">
        ℹ️ About TruthLens
      </h1>

      {/* Intro */}
      <p className="text-gray-400 text-center max-w-2xl mb-10 leading-relaxed">
        TruthLens is an AI-powered fact-checking platform built to fight the
        growing threat of misinformation. By leveraging advanced natural
        language processing and real-time verification sources, it empowers
        users to distinguish between authentic news and misleading claims.
      </p>

      {/* Mission Section */}
      <div className="w-full max-w-3xl bg-black/40 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-700 mb-10">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
          🎯 Our Mission
        </h2>
        <p className="text-gray-300 leading-relaxed">
          In today’s digital era, misinformation spreads faster than truth.
          TruthLens exists to slow down the spread of fake news by providing a
          simple yet powerful way for everyone to check the authenticity of
          information before sharing it.  
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
        <div className="bg-black/40 rounded-2xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            ✅ Verify Instantly
          </h3>
          <p className="text-gray-400">
            Paste a headline or link, and TruthLens checks it against trusted
            fact-checking databases.
          </p>
        </div>
        <div className="bg-black/40 rounded-2xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-yellow-400 mb-3">
            🔎 AI-Powered Insights
          </h3>
          <p className="text-gray-400">
            Our algorithms analyze claims and highlight suspicious or misleading
            patterns.
          </p>
        </div>
        <div className="bg-black/40 rounded-2xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-blue-400 mb-3">
            🌍 Credible Sources
          </h3>
          <p className="text-gray-400">
            We provide references from reliable fact-checkers and news agencies
            to ensure accuracy.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="w-full max-w-3xl bg-black/40 rounded-2xl p-8 shadow-xl border border-gray-700 text-center">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
          👨‍💻 Built by Developers for Society
        </h2>
        <p className="text-gray-400 leading-relaxed">
          TruthLens is an open initiative crafted with ❤️ to empower individuals
          against the dangers of fake news. Every search you make helps build a
          safer, more truthful digital space.
        </p>
      </div>
    </div>
  );
};

export default About;
