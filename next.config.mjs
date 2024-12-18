export default {
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
