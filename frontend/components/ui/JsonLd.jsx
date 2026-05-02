/**
 * JsonLd.jsx — Injection de données structurées schema.org
 * Compatible 'use client' pages (App Router).
 */

export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
