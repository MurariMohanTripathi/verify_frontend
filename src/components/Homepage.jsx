import React from "react";
import { motion } from "framer-motion";
import { Search, Users, ShieldCheck } from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white">

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-24 relative">
        {/* Glow background */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-96 h-96 bg-blue-700/20 blur-[130px] rounded-full"></div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-xl"
        >
          Stop Fake News  
          <br />
          Before It Spreads
        </motion.h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed">
          Instantly verify any news headline or link using AI + community validation.
          Stay informed and stay protected from misinformation—quickly and effortlessly.
        </p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 flex w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-2 shadow-lg"
        >
          <input
            type="text"
            placeholder="Paste news link or headline..."
            className="flex-1 px-4 py-3 text-gray-100 bg-transparent placeholder-gray-400 outline-none"
          />
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-full flex items-center gap-2 text-white font-semibold">
            <Search className="w-5 h-5" /> Check
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-gray-900 relative">
        <h3 className="text-4xl font-bold text-center mb-14">
          Key Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-gray-800/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg text-center cursor-pointer"
            onClick={() => navigate('/News-Page')}
          >
            <ShieldCheck className="w-14 h-14 mx-auto text-blue-400" />
            <h4 className="mt-5 text-2xl font-semibold">Latest News</h4>
            <p className="mt-3 text-gray-400">
              Access verified, real-time global news curated from trusted sources.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-gray-800/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg text-center"
          >
            <ShieldCheck className="w-14 h-14 mx-auto text-purple-400" />
            <h4 className="mt-5 text-2xl font-semibold">AI Fact-Checking</h4>
            <p className="mt-3 text-gray-400">
              AI cross-verifies claims using databases, ML models & trusted sources.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-gray-800/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg text-center cursor-pointer"
            onClick={() => navigate('/community-voting')}
          >
            <Users className="w-14 h-14 mx-auto text-green-400" />
            <h4 className="mt-5 text-2xl font-semibold">Community Voting</h4>
            <p className="mt-3 text-gray-400">
              Public voting creates a credibility score—powered by people.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-gray-800/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg text-center md:col-span-3"
          >
            <Search className="w-14 h-14 mx-auto text-pink-400" />
            <h4 className="mt-5 text-2xl font-semibold">Instant Verification</h4>
            <p className="mt-3 text-gray-400">
              Paste → Click → Verified. Fastest way to confirm authenticity.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
