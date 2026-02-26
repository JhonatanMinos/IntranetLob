export type User = {
    id: number;
    name: string;
    email: string;
    employeeNumber?: string | null;
    position?: string | null;
    phone?: string | null;
    birthday?: string | null; // Y-m-d format
    dateEntry?: string | null; // Y-m-d format
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    roles?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
