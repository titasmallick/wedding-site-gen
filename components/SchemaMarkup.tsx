import React from 'react';

export const SchemaMarkup = () => {
  const weddingSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "The Wedding of Titas and Sukanya",
    "startDate": "2026-01-23T18:00",
    "endDate": "2026-01-23T23:59",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Anandamayee Bhawan",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Serampore",
        "addressRegion": "West Bengal",
        "addressCountry": "IN"
      }
    },
    "image": [
      "https://www.titas-sukanya-for.life/invite.jpeg",
      "https://www.titas-sukanya-for.life/pw/020.jpg"
    ],
    "description": "Join us in celebrating the wedding of Titas and Sukanya. A journey of love beginning in Serampore.",
    "organizer": {
      "@type": "Person",
      "name": "Titas Mallick"
    },
    "performer": {
      "@type": "Person",
      "name": "Titas and Sukanya"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.titas-sukanya-for.life/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Our Story",
        "item": "https://www.titas-sukanya-for.life/couple"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Gallery",
        "item": "https://www.titas-sukanya-for.life/memories"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(weddingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
