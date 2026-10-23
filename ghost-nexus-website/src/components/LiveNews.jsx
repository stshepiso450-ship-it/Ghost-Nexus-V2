import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function LiveNews() {
  const [news, setNews] = useState([]);
  const [status, setStatus] = useState("CONNECTING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      try {
        const response = await fetch(
          `${API_URL}/market/news`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("News endpoint unavailable");
        }

        const data = await response.json();

        if (!mounted) return;

        const incoming =
          Array.isArray(data)
            ? data
            : data.news ||
              data.articles ||
              data.data ||
              [];

        setNews(incoming);
        setStatus("LIVE");
      } catch {
        if (mounted) {
          setStatus("WAITING");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNews();

    const interval = setInterval(
      loadNews,
      60000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const normalizedNews = news.map(
    (item, index) => ({
      id:
        item.id ||
        item.url ||
        `news-${index}`,

      title:
        item.title ||
        item.headline ||
        "Market News",

      source:
        item.source ||
        item.publisher ||
        "Market News",

      time:
        item.time ||
        item.published_at ||
        item.publishedAt ||
        "--",

      url:
        item.url ||
        item.link ||
        "#",

      category:
        item.category ||
        item.topic ||
        "MARKETS",

      image:
        item.image ||
        item.image_url ||
        null,
    })
  );

  return (
    <section
      className="ghost-live-news"
      aria-labelledby="live-news-title"
    >
      <div className="ghost-news-container">

        <div className="ghost-news-header">

          <div>
            <span className="ghost-section-kicker">
              GLOBAL MARKET INTELLIGENCE
            </span>

            <h2 id="live-news-title">
              Live Financial News
            </h2>

            <p>
              Follow important forex, commodities,
              economic and financial market developments.
            </p>
          </div>

          <div className="ghost-calendar-status">

            <span
              className={`ghost-chart-dot ${status.toLowerCase()}`}
            />

            {status}

          </div>

        </div>

        <div className="ghost-news-grid">

          {loading && (
            <div className="ghost-news-empty">
              Loading live market news...
            </div>
          )}

          {!loading &&
            normalizedNews.length === 0 && (
              <div className="ghost-news-empty">
                No live news available.
              </div>
            )}

          {!loading &&
            normalizedNews.map(
              (article) => (
                <article
                  key={article.id}
                  className="ghost-news-card"
                >

                  {article.image && (
                    <div className="ghost-news-image">
                      <img
                        src={article.image}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="ghost-news-content">

                    <div className="ghost-news-meta">

                      <span>
                        {article.category}
                      </span>

                      <span>
                        {article.time}
                      </span>

                    </div>

                    <h3>
                      {article.title}
                    </h3>

                    <p>
                      {article.source}
                    </p>

                    {article.url !== "#" && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        READ ARTICLE →
                      </a>
                    )}

                  </div>

                </article>
              )
            )}

        </div>

      </div>
    </section>
  );
}