/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
    serverComponentsExternalPackages: [
      'bcryptjs',
      'jsonwebtoken',
      'nodemailer',
      'stripe',
    ],
  },
  webpack: (config) => {
    config.parallelism = 1
    return config
  },
}

module.exports = nextConfig
