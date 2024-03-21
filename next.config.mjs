/** @type {import('next').NextConfig} */
const nextConfig = {
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
