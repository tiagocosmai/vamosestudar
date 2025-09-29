/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['encrypted-tbn0.gstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ],
  },
  // Desabilita o watchpack para ambientes corporativos
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: false,
        ignored: /node_modules/,
      }
    }
    return config
  },
  // Desabilita o fast refresh se necessário
  experimental: {
    // fastRefresh: false, // Descomente se necessário
  },
}

module.exports = nextConfig
