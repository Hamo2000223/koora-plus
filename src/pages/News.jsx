import React, { useEffect, useState } from "react";

const PAGE_SIZE = 8;
const NEWS_API_BASE = `/api/news`;
const DEFAULT_IMAGE = "/logo.svg"; // You can use your logo or a generic news placeholder

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNews = async (pageNum = 1, append = false) => {
    // Use backend endpoint
    const url = `${NEWS_API_BASE}?q=كرة القدم&language=ar&sortBy=publishedAt&pageSize=${PAGE_SIZE}&page=${pageNum}`;
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "ok") {
        setArticles(prev => append ? [...prev, ...(data.articles || [])] : (data.articles || []));
        setTotalResults(data.totalResults);
        setError(null);
      } else {
        setError(data.message || data.error || "حدث خطأ أثناء جلب الأخبار / Error fetching news");
      }
    } catch {
      setError("حدث خطأ أثناء جلب الأخبار / Error fetching news");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews(1, false);
    setPage(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#181818] text-white font-sans" dir="rtl">
      <main className="flex-1 flex flex-col items-center px-2 xs:px-4 py-4 xs:py-8">
        <section className="w-full max-w-7xl mx-auto">
          <div className="rounded-2xl bg-[#23272f] shadow-md p-3 xs:p-6 md:p-8 flex flex-col gap-4 border-2 border-[#0a2342]">
            <h2 className="text-2xl font-bold mb-2 text-right" style={{color: '#e63946'}}>
              آخر أخبار كرة القدم 
            </h2>
            {loading && <div className="text-center text-gray-400 py-8">جاري التحميل... / Loading...</div>}
            {error && <div className="text-center text-red-400 py-8">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((article, idx) => (
                <div key={idx} className="flex flex-col bg-[#181818] rounded-xl shadow-lg border border-[#23272f] overflow-hidden hover:scale-[1.02] transition-transform duration-200">
                  <img
                    src={article.urlToImage || DEFAULT_IMAGE}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={e => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                  />
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    <h3 className="font-bold text-lg text-[#FFD700] text-right">{article.title}</h3>
                    <p className="text-gray-300 text-sm text-right">{article.description}</p>
                    <div className="flex flex-wrap justify-between items-center mt-2 text-xs text-gray-400">
                      <span>{article.source?.name}</span>
                      <span>{new Date(article.publishedAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-400 hover:underline text-xs text-left">Read more / اقرأ المزيد</a>
                  </div>
                </div>
              ))}
            </div>
            {!loading && articles.length === 0 && !error && (
              <div className="text-center text-gray-400 py-8">لا توجد أخبار متاحة حالياً / No news available.</div>
            )}
            {/* Load More Button */}
            {totalResults !== null && articles.length < totalResults && !loading && !error && (
              <button
                onClick={handleLoadMore}
                className="mx-auto mt-6 px-6 py-2 rounded-lg bg-[#e63946] text-white font-bold hover:bg-[#c92d3b] transition disabled:opacity-60"
                disabled={loadingMore}
              >
                {loadingMore ? "جاري التحميل... / Loading..." : "تحميل المزيد من الأخبار / Load more news"}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default News; 