import type { NextConfig } from 'next';

const requestedBasePath = process.env.ACK_BASE_PATH?.trim();
const basePath = requestedBasePath
  ? `/${requestedBasePath.replace(/^\/+|\/+$/g, '')}`
  : undefined;

const nextConfig: NextConfig = {
  // Set ACK_BASE_PATH=/ack-techs when this app is mounted below the personal
  // site. Leave it unset when ACK Techs is served from its own domain.
  basePath,
  trailingSlash: true,
};

export default nextConfig;
