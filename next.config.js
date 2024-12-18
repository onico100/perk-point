module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*", // Apply to all API routes
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};
