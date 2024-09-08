import {withSentryConfig} from '@sentry/nextjs';
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
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '54321',
                pathname: '/storage/v1/object/sign/**',
            },
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

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

// Suppresses source map uploading logs during build
    silent: true,
    org: "schenier-wi",
    project: "click2eat-restaurant",
}, {
// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

// Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
    tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
    hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors.
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
});