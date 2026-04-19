import React, { useState } from "react";
import { Search } from "lucide-react";

const FactCheck = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Call AI / API / Firebase to check fact
    console.log("Checking:", query);

    // Mock result
    const mockResult = {
      verdict: "False",
      confidence: "85%",
      explanation:
        "Multiple fact-checking sources confirmed this news is fabricated.",
      sources: [
        "https://www.reuters.com/fact-check",
        "https://www.snopes.com/",
      ],
    };

    setResult(mockResult);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-12">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6 text-center">
        🔍 Fact Check News
      </h1>
      <p className="text-gray-400 text-center max-w-lg mb-8">
        Enter a news headline or article link below to verify its authenticity.
      </p>

      {/* Search Box */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-2xl items-center bg-black/40 rounded-xl shadow-lg px-4 py-2 mb-8 border border-gray-700"
      >
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste headline or URL here..."
          className="flex-1 p-3 bg-transparent text-white focus:outline-none"
          required
        />
        <button
          type="submit"
          className="ml-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
        >
          Check
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4 border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-300">
            Verdict:{" "}
            <span
              className={`font-bold ${
                result.verdict === "True"
                  ? "text-green-400"
                  : result.verdict === "False"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {result.verdict}
            </span>
          </h2>
          <p className="text-gray-300">
            Confidence: <span className="font-medium">{result.confidence}</span>
          </p>
          <p className="text-gray-400">{result.explanation}</p>

          <div>
            <h3 className="font-medium text-gray-300 mb-2">Sources:</h3>
            <ul className="list-disc pl-5 space-y-1 text-blue-400">
              {result.sources.map((src, idx) => (
                <li key={idx}>
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {src}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactCheck;
