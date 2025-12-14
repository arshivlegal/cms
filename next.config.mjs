/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
  experimental: {
    middlewareClientMaxBodySize: 50 * 1024 * 1024,
  },
};

export default nextConfig;
