/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wmgdpgvbbircbtpnubyj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: '/quiz/quiz',
        destination: '/quiz',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
