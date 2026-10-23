import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  "http://localhost:5173";

export default function SEO({
  title = "Ghost Nexus",
  description = "Ghost Nexus intelligent market technology and trading intelligence.",
  path = "/",
}) {
  const fullTitle =
    title === "Ghost Nexus"
      ? title
      : `${title} | Ghost Nexus`;

  const canonicalUrl =
    `${SITE_URL}${path}`;

  return (
    <Helmet>
      <html lang="en" />

      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* Open Graph */}

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:site_name"
        content="Ghost Nexus"
      />

      {/* Twitter */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={description}
      />
    </Helmet>
  );
}