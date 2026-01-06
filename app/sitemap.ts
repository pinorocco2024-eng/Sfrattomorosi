import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "https://sfrattomorosi.it";
  const now = new Date();

  const urls = [
    "/",
    "/preventivo",
    "/servizi",
    "/blog",
    "/blog/sfratto-per-morosita-tempi-costi-2025",
    "/blog/prevenire-morosita-locazione",
    "/blog/fase-esecutiva-sfratto-cosa-aspettarsi",
    "/faq",
    "/contatti",
  ];

  return urls.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));
}