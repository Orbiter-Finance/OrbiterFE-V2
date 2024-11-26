/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  serverExternalPackages: ["keyv"],
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }, { protocol: 'http', hostname: '**' }]
  },
  webpack: (config, { isServer }) => {

    if (isServer) {
      config.externals.push({
        punycode: 'punycode',
        "punycode/": 'punycode',
      })
    }

    // config.resolve.alias['punycode'] = path.resolve(__dirname, 'node_modules/punycode/');

    return config
  },
  // experimental: {
  //   serverActions: true,
  // },
}

export default nextConfig
