/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const repo = 'DBCM';

const assetPrefix = isProd? `DBCM/${repo}/` : '';
const basePath = isProd ? `DBCM/${repo}` : '';

const nextConfig = {
  assetPrefix: assetPrefix,
  basePath: basePath,

  reactStrictMode: true,
  trailingSlash: true,
  // productionBrowserSourceMaps: true,
  images: {
    unoptimized: true,
    loader: "akamai",
    path: "",
  }
};

module.exports = nextConfig;
