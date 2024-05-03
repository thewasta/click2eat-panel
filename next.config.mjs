/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'standalone',
    logging:{
        fetches:{
            fullUrl: true
        }
    },
    images:{
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api-dev.click2eat.es'
            },
            {
                protocol: 'https',
                hostname: 'cdn.dummyjson.com'
            },
            {
                protocol: 'https',
                hostname: 'placehold.co'
            }
        ]
    }
};

export default nextConfig;
