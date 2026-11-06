/**
 * components/Seo.jsx
 * =====================
 * Per-page SEO: sets document title, meta description, and canonical URL
 * for each route. index.html carries the site-wide defaults (OG, Twitter,
 * JSON-LD); this overrides the title/description per page for better
 * search-result snippets.
 */

import { Helmet } from "react-helmet-async";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://cardioassist.ai";

export default function Seo({ title, description, path = "/" }) {
  const fullTitle = title ? `${title} | CardioAssist AI` : "CardioAssist AI";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={`${SITE_URL}${path}`} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={`${SITE_URL}${path}`} />
    </Helmet>
  );
}
