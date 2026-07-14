/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wmgdpgvbbircbtpnubyj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
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
