/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '*.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'ronit-food-ordering.s3.amazonaws.com',
            },
        ]
    }
};

export default nextConfig;
