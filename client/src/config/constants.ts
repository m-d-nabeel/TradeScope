export const APP_CONFIG = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    AUTH_PROVIDER: 'google',
    TOKEN_STORAGE_KEY: 'auth_token',
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
};