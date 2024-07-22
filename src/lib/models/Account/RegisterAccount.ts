export type RegisterAccount = {
    businessName?: string | undefined;
    document?: string | undefined;
    address?: string | undefined;
    postalCode?: number | undefined;
    province?: string | undefined;
    town?: string | undefined;
    country?: string | undefined;
    name?: string | undefined;
    lastName?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    confirmPassword?: string | undefined;
    fcmToken?: string | undefined;
    timeZone?: number;
}