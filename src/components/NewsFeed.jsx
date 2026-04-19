import { useEffect, useState } from "react";
import { fetchHeadlines } from "../services/newsApi";

function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeadlines().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  // Format Date (dd/mm/yyyy hh:mm)
  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white text-xl">
        ⏳ Loading news...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
        📰 Latest Headlines
      </h1>

      {articles.length === 0 ? (
        <p className="text-center text-red-400">⚠️ No news articles found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-blue-500/40 transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {a.urlToImage && (
                <img
                  src={a.urlToImage}
                  alt={a.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-bold text-lg mb-2 hover:text-blue-400 transition-colors">
                  {a.title}
                </h2>
                <p className="text-sm text-gray-400 mb-3 flex-grow">
                  {a.description || "No description available."}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  Source: <span className="text-blue-400">{a.source?.name}</span>
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Published: {formatDate(a.publishedAt)}
                </p>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsFeed;
