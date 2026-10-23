import React from "react";
import SEO from "../components/SEO";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const articles = [
  {
    category: "TRADING",
    title: "Understanding Market Structure",
    description:
      "Learn how traders can study market structure and price behaviour.",
  },
  {
    category: "EDUCATION",
    title: "Trading Risk Management",
    description:
      "Explore the importance of risk management when developing a trading plan.",
  },
  {
    category: "TECHNOLOGY",
    title: "The Future of Trading Technology",
    description:
      "Discover how AI, automation and connected platforms are changing trading technology.",
  },
];

export default function Blog() {
  return (
    <>
      <SEO
        title="Ghost Nexus Trading Blog"
        description="Read Ghost Nexus trading insights, market education, trading technology updates and platform news."
        path="/blog"
      />

      <Navbar />

      <main className="ghost-page ghost-blog-page">

        <section className="ghost-page-hero">

          <span className="ghost-section-kicker">
            GHOST NEXUS BLOG
          </span>

          <h1>
            Intelligence.
            <span> Education. Insight.</span>
          </h1>

          <p>
            Trading education, market intelligence
            and Ghost Nexus technology updates.
          </p>

        </section>

        <section className="ghost-blog-grid">

          {articles.map((article, index) => (
            <article
              className="ghost-blog-card"
              key={index}
            >

              <span>
                {article.category}
              </span>

              <h2>
                {article.title}
              </h2>

              <p>
                {article.description}
              </p>

              <button
                type="button"
                onClick={() => {
                  console.log(
                    "Blog article:",
                    article.title
                  );
                }}
              >
                READ ARTICLE →
              </button>

            </article>
          ))}

        </section>

      </main>

      <Footer />
    </>
  );
}