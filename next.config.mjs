/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-simple-maps ships ESM (d3-*) that Next needs to transpile.
  transpilePackages: ["react-simple-maps"],
};

export default nextConfig;
