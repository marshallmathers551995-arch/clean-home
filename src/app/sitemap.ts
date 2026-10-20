import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const PAGES = ["", "/products", "/bundles", "/how-to-order", "/about", "/contact"];

// Rendered per request so the URL always matches the domain the site is served from.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PAGES.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));
}
