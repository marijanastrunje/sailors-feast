// src/components/common/SEO.js
import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  ogImage = '/img/logo/white-color-logo-horizontal-sailors-feast.svg',
  ogType = 'website'
}) => {
  // Dodajte naziv web stranice titlu
  const siteTitle = title ? `${title} | Sailor's Feast` : "Sailor's Feast - Fresh Food Delivery Service";
  
  // Definirajte default opis ako nije proslijeđen
  const metaDescription = description || "Sailor's Feast delivers fresh groceries and pre-configured meal boxes directly to your boat in Croatian marinas. Save time and enjoy quality food on your sailing adventure.";
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical link */}
      <link rel="canonical" href={window.location.href} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={window.location.href} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;