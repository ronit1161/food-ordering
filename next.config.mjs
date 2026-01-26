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
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
        // Image optimization settings
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
    }
};

export default nextConfig;
