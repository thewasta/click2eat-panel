namespace NodeJS {
    interface ProcessEnv {
        API_BASE_URL: string;
        MOCK_BASE_API_URL: string;
        MOCK_BASE_PRODUCTS: string;
        ENV: string;
        TEST_USERNAME: string;
        TEST_PASSWORD: string;
        NEXT_PUBLIC_COOKIE_NAME: string;
        NEXT_PUBLIC_FCM_VAPID_KEY: string;
        NEXT_PUBLIC_FCM_API_KEY: string;
        NEXT_PUBLIC_FCM_AUTH_DOMAIN: string;
        NEXT_PUBLIC_FCM_PROJECT_ID: string;
        NEXT_PUBLIC_FCM_STORAGE_BUCKET: string;
        NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID: string;
        NEXT_PUBLIC_FCM_APP_ID: string;
        NEXT_PUBLIC_FCM_MEASUREMENT_ID: string;
        SENTRY_DSN: string;
        SENTRY_ENABLE: boolean;
        NEXT_PUBLIC_SENTRY_DSN: string;
    }
}