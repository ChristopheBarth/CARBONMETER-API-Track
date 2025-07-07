/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      inspector: false,  // ← désactive le badge “N”
    },
  },
};

module.exports = nextConfig;