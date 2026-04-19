import { useState } from "react";
import { submitNews } from "../services/backendAPI";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function SubmitNews() {
  const [form, setForm] = useState({
    title: "",
    url: "",
    source: "",
    submittedBy: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitNews(form);
      alert("News Submitted Successfully!");
      setForm({ title: "", url: "", source: "", submittedBy: "" });
    } catch (err) {
      console.log("Submit Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-gray-800/60 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          📝 Submit News for Verification
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Help the community verify questionable news by submitting it here.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-1 text-gray-300">News Title *</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter headline"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block mb-1 text-gray-300">News URL (Optional)</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://example.com/article"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>

          {/* Source */}
          <div>
            <label className="block mb-1 text-gray-300">Source / Platform</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Twitter, Instagram, Website, etc."
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </div>

          {/* Submitted By */}
          <div>
            <label className="block mb-1 text-gray-300">Your Name (Optional)</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Anonymous"
              value={form.submittedBy}
              onChange={(e) => setForm({ ...form, submittedBy: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold text-white shadow-lg"
          >
            <Send className="w-5 h-5" />
            Submit News
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
