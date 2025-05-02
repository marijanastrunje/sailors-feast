import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType,
  path
}) => {

  const baseUrl = "https://www.sailorsfeast.com";

  const canonicalUrl = path ? `${baseUrl}${path}` : baseUrl;

  const siteTitle = title ? `${title} | Sailor's Feast` : "Sailor's Feast - Fresh Food Delivery Service";

  const metaDescription = description || "Sailor's Feast delivers fresh groceries and customizable food and drinks boxes directly to your boat in Croatian marinas. Save time and enjoy quality food on your sailing vacation.";

  const metaKeywords = keywords && keywords.length > 0
    ? keywords.join(', ')
    : 'sailing, groceries, Croatia, boat food, Sailor\'s Feast';

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Canonical link */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      {canonicalUrl && <meta property="twitter:url" content={canonicalUrl} />}
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

SEO.defaultProps = {
  ogImage: '/img/logo/white-color-logo-horizontal-sailors-feast.svg',
  ogType: 'website',
  description: "Sailor's Feast delivers fresh groceries and customizable food and drinks boxes directly to your boat in Croatian marinas. Save time and enjoy quality food on your sailing vacation.",
  keywords: []
};

export default SEO;