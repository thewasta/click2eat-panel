/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    logging:{
        fetches:{
            fullUrl: true
        }
    },
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.dummyjson.com'
            }
        ]
    }
};

export default nextConfig;
