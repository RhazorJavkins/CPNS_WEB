/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://cpns-web-coral.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
    additionalSitemaps: [],
  },
};
