const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
        endpoints: {
            auth: {
                login: import.meta.env.VITE_API_AUTH_PATH || '/auth',
                validate: import.meta.env.VITE_API_VALIDATE_PATH || '/auth/validate',
            },
        },
    },
    app: {
        name: import.meta.env.VITE_APP_NAME || 'Management UI',
        env: import.meta.env.VITE_APP_ENV || 'development',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    },
    features: {
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        logging: import.meta.env.VITE_ENABLE_LOGGING !== 'false',
    },
    pagination: {
        defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10', 10),
        maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100', 10),
    },
};

export default config;
