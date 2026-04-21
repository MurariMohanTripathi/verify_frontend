import React, { useState } from "react";
import { Search, Loader2, MessageSquare, Send } from "lucide-react";
import { aiFactCheck, chatWithNewsAI } from "../services/backendAPI";

const FactCheck = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // New States for the Deep Dive Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setChatMessages([]); // Reset chat when searching a new claim

    try {
      const response = await aiFactCheck(query);
      if (response.success) {
        const aiData = response.data;
        setResult({
          originalClaim: query, // Store this to send to the chat API
          verdict: aiData.isLikelyFake ? "False" : (aiData.credibilityScore > 60 ? "True" : "Review"),
          confidence: `${aiData.credibilityScore}%`,
          explanation: aiData.summary,
          sources: [aiData.advice] 
        });
      }
    } catch (error) {
      alert("Failed to analyze the news. Make sure your backend is running!");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput("");
    
    // Add user message to UI immediately
    setChatMessages(prev => [...prev, { role: "user", text: userText }]);
    setIsChatting(true);

    try {
      const response = await chatWithNewsAI(result.originalClaim, userText);
      if (response.success) {
        // Add AI reply to UI
        setChatMessages(prev => [...prev, { role: "ai", text: response.reply }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: "ai", text: "⚠️ Error connecting to AI." }]);
    } finally {
      setIsChatting(false);
    }
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
      <form onSubmit={handleSubmit} className="flex w-full max-w-2xl items-center bg-black/40 rounded-xl shadow-lg px-4 py-2 mb-8 border border-gray-700">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste headline or URL here..."
          className="flex-1 p-3 bg-transparent text-white focus:outline-none"
          required
        />
        <button type="submit" disabled={loading} className="ml-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check"}
        </button>
      </form>

      {/* Results & Chat Container */}
      {result && (
        <div className="w-full max-w-2xl flex flex-col gap-6">
          
          {/* Main Verdict Card */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4 border border-gray-700">
            <h2 className="text-xl font-semibold text-blue-300">
              Verdict:{" "}
              <span className={`font-bold ${ result.verdict === "True" ? "text-green-400" : result.verdict === "False" ? "text-red-400" : "text-yellow-400" }`}>
                {result.verdict}
              </span>
            </h2>
            <p className="text-gray-300">
              Confidence: <span className="font-medium">{result.confidence}</span>
            </p>
            <p className="text-gray-400">{result.explanation}</p>
            <div>
              <h3 className="font-medium text-gray-300 mb-2">Sources / Advice:</h3>
              <ul className="list-disc pl-5 space-y-1 text-blue-400">
                {result.sources.map((src, idx) => ( <li key={idx}>{src}</li> ))}
              </ul>
            </div>
          </div>

          {/* Discussion / Argue Box */}
          <div className="bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-gray-700">
            <h3 className="flex items-center text-lg font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-400" /> Deep Dive & Discuss
            </h3>
            
            {/* Chat History */}
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {chatMessages.length === 0 && (
                <p className="text-gray-500 text-sm text-center italic">Have doubts? Ask for more details or argue the verdict below.</p>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-700 text-gray-200 rounded-bl-sm"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-400 p-3 rounded-2xl rounded-bl-sm text-sm flex gap-1 items-center">
                    <span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleChatSubmit} className="flex gap-2 relative mt-4">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Why did you give it that score? Provide proof."
                className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
              <button type="submit" disabled={isChatting} className="bg-blue-600 hover:bg-blue-500 px-4 rounded-xl flex justify-center items-center transition disabled:opacity-50">
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default FactCheck;