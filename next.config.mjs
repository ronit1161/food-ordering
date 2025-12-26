/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            },
            {
                protocol: 'http',
                hostname: '*.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'ronit-food-ordering.s3.amazonaws.com',
            },
            {
                protocol: 'http',
                hostname: 'ronit-food-ordering.s3.amazonaws.com',
            },
        ]
    }
};

export default nextConfig;
