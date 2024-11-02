// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/', // Source path to match
        destination: '/login', // Destination path to redirect to
        permanent: true // Indicates a 308 permanent redirect
      }
    ];
  }
};

export default nextConfig;
