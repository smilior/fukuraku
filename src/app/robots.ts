import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/settings/", "/auth/", "/onboarding/", "/receipt/", "/expense/", "/income/", "/summary/", "/offline/"],
      },
    ],
    sitemap: "https://fukuraku.smilior.com/sitemap.xml",
  };
}
