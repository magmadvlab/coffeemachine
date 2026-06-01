/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // @react-pdf/renderer va eseguito lato server in runtime Node
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};
export default nextConfig;
