namespace NodeJS {
    interface ProcessEnv {
        APP_ENV: string;
        NEXT_PUBLIC_DOMAIN: string;
        NEXT_PUBLIC_AUTH0_CALLBACK_URL: string;
        NEXT_PUBLIC_FCM_VAPID_KEY: string;
        NEXT_PUBLIC_FCM_API_KEY: string;
        NEXT_PUBLIC_FCM_AUTH_DOMAIN: string;
        NEXT_PUBLIC_FCM_PROJECT_ID: string;
        NEXT_PUBLIC_FCM_STORAGE_BUCKET: string;
        NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID: string;
        NEXT_PUBLIC_FCM_APP_ID: string;
        NEXT_PUBLIC_FCM_MEASUREMENT_ID: string;
        SENTRY_ENABLE: boolean;
        SENTRY_DEBUG: boolean;
        SENTRY_DSN: string;
        NEXT_PUBLIC_SENTRY_DSN: string;
        SENTRY_AUTH_TOKEN: string;
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        SUPABASE_SERVICE_ROLE_KEY: string;
        NEXT_PUBLIC_STRIPE_SECRET: string;
        STRIPE_SECRET_KEY: string;
        STRIPE_WEBHOOK_SECRET: string;
        NEXT_PUBLIC_HCAPTCHA_TOKEN: string;
    }
}