import type { MetadataRoute } from "next";
import articles from "@/content/articles.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/work", "/blog", "/get-started.html",
    "/work/legit-logistics", "/work/delivah-dispatch-hub", "/work/kossy-langat",
    ...articles.posts.map((post) => `/blog/${post.slug}`),
  ];
  return paths.map((path) => ({ url: `https://codebyleon.com${path}` }));
}
