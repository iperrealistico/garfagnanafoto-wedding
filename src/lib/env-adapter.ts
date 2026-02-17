/**
 * Env Adapter to handle various naming conventions for Supabase and GitHub keys.
 * Maps multiple possible env var names to a single canonical set used in code.
 */

export const getEnv = (key: string): string => {
    switch (key) {
        case "SUPABASE_URL":
            return (
                process.env.NEXT_PUBLIC_SUPABASE_URL ||
                process.env.SUPABASE_URL ||
                process.env.NEXT_PUBLIC_GARFAGNANAFOTO_WEDDING__SUPABASE_URL ||
                process.env.GARFAGNANAFOTO_WEDDING__SUPABASE_URL ||
                ""
            );
        case "SUPABASE_ANON_KEY":
            return (
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                process.env.SUPABASE_ANON_KEY ||
                process.env.NEXT_PUBLIC_GARFAGNANAFOTO_WEDDING__SUPABASE_ANON_KEY ||
                process.env.GARFAGNANAFOTO_WEDDING__SUPABASE_ANON_KEY ||
                ""
            );
        case "SUPABASE_SERVICE_ROLE_KEY":
            return (
                process.env.SUPABASE_SERVICE_ROLE_KEY ||
                process.env.GARFAGNANAFOTO_WEDDING__SUPABASE_SERVICE_ROLE_KEY ||
                ""
            );
        case "GITHUB_TOKEN":
            return process.env.GITHUB_TOKEN || "";
        case "GITHUB_OWNER":
            return process.env.GITHUB_OWNER || "";
        case "GITHUB_REPO_NAME":
            return process.env.GITHUB_REPO_NAME || "";
        case "ADMIN_PASSWORD":
            return process.env.ADMIN_PASSWORD || "";
        case "ADMIN_SESSION_SECRET":
            return process.env.ADMIN_SESSION_SECRET || "";
        default:
            return process.env[key] || "";
    }
};

export const env = {
    supabase: {
        url: getEnv("SUPABASE_URL"),
        anonKey: getEnv("SUPABASE_ANON_KEY"),
        serviceKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    },
    github: {
        token: getEnv("GITHUB_TOKEN"),
        owner: getEnv("GITHUB_OWNER"),
        repo: getEnv("GITHUB_REPO_NAME"),
        branch: process.env.GITHUB_BRANCH || "main",
    },
    admin: {
        password: getEnv("ADMIN_PASSWORD"),
        sessionSecret: getEnv("ADMIN_SESSION_SECRET"),
    }
};

/**
 * Validates that all critical env vars are present.
 * Should be called server-side during initialization or build.
 */
export const validateEnvs = () => {
    const missing = [];
    if (!env.supabase.url) missing.push("SUPABASE_URL");
    if (!env.supabase.serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    if (!env.admin.password) missing.push("ADMIN_PASSWORD");

    if (missing.length > 0) {
        console.error("CRITICAL ERROR: Missing environment variables:", missing.join(", "));
        // In production, we might want to throw or exit, but for now we log.
    }
    return missing.length === 0;
};
