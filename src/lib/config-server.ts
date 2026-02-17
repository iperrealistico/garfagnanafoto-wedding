import { createClient } from "./supabase";
import { AppConfig, AppConfigSchema } from "./config-schema";
import { DEFAULT_CONFIG } from "./default-config";
import { env } from "./env-adapter";

const CONFIG_KEY = "garfagnanafoto:wedding:config:v1";

export async function getAppConfig(): Promise<AppConfig> {
    if (!env.supabase.serviceKey || !env.supabase.url) {
        console.warn("Missing Supabase credentials. Returning default config.");
        return AppConfigSchema.parse(DEFAULT_CONFIG);
    }

    const supabase = await createClient();


    const { data, error } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", CONFIG_KEY)
        .single();

    if (error || !data) {
        console.log("Config not found or error, using default.", error);
        // Attempt seed? Or just return default.
        // Let's return default, but maybe trigger seed asynchronously?
        // Better to just return default for now.
        return AppConfigSchema.parse(DEFAULT_CONFIG);
    }

    try {
        return AppConfigSchema.parse(data.value);
    } catch (e) {
        console.error("Config parsing failed, falling back to default", e);
        return AppConfigSchema.parse(DEFAULT_CONFIG);
    }
}

export async function updateAppConfig(newConfig: AppConfig): Promise<void> {
    const supabase = await createClient();
    const parsed = AppConfigSchema.parse(newConfig);

    const { error } = await supabase
        .from("app_config")
        .upsert({ key: CONFIG_KEY, value: parsed }, { onConflict: "key" });

    if (error) {
        throw new Error(`Failed to update config: ${error.message}`);
    }
}

export async function seedConfig(): Promise<void> {
    const supabase = await createClient();
    const { data } = await supabase.from("app_config").select("key").eq("key", CONFIG_KEY).single();
    if (!data) {
        console.log("Seeding default config...");
        await updateAppConfig(AppConfigSchema.parse(DEFAULT_CONFIG));
    }
}
