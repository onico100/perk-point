/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store", // Disable caching
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
