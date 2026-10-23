import React from "react";
import "../styles/app.css";

const reviews = [
  {
    name: "Michael",
    role: "Forex Trader",
    rating: 5,
    text:
      "The Ghost Nexus interface makes it much easier to monitor the markets without jumping between different platforms.",
  },
  {
    name: "Daniel",
    role: "Day Trader",
    rating: 5,
    text:
      "I like having the market information, sessions and AI analysis together in one dashboard.",
  },
  {
    name: "Lerato",
    role: "Market Analyst",
    rating: 5,
    text:
      "The platform has a clean futuristic design and gives me a quick view of what is happening across the markets.",
  },
];

export default function ClientReviews() {
  return (
    <section
      className="ghost-reviews-section"
      aria-labelledby="ghost-reviews-title"
    >
      <div className="ghost-reviews-container">

        <div className="ghost-reviews-header">
          <span className="ghost-section-kicker">
            COMMUNITY
          </span>

          <h2 id="ghost-reviews-title">
            What Traders Say
          </h2>

          <p>
            Discover how traders and market
            enthusiasts experience Ghost Nexus.
          </p>
        </div>

        <div className="ghost-reviews-grid">

          {reviews.map((review) => (
            <article
              className="ghost-review-card"
              key={review.name}
            >

              <div className="ghost-review-stars">
                {"★".repeat(review.rating)}
              </div>

              <blockquote>
                "{review.text}"
              </blockquote>

              <div className="ghost-review-author">

                <div className="ghost-review-avatar">
                  {review.name.charAt(0)}
                </div>

                <div>
                  <strong>
                    {review.name}
                  </strong>

                  <span>
                    {review.role}
                  </span>
                </div>

              </div>

            </article>
          ))}

        </div>

        <div className="ghost-review-disclaimer">
          Reviews displayed on this website should
          represent genuine customer experiences.
        </div>

      </div>
    </section>
  );
}