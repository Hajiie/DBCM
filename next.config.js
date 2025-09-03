/** @type {import('next').NextConfig} */

const repo = 'DBCM'; // 예: 'my-nextjs-site'
const assetPrefix = `/${repo}/`;
const basePath = `/${repo}`;

const nextConfig = {
  output: 'export',
  assetPrefix: assetPrefix,
  basePath: basePath,

  reactStrictMode: true,
  trailingSlash: true,
  // productionBrowserSourceMaps: true,
  images: {
    loader: "akamai",
    path: "",
  }
};

module.exports = nextConfig
