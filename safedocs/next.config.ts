import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 🍪 Configuración para HttpOnly Cookies
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  
  // 🌐 Configurar rewrites si tu backend está en otro puerto
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
