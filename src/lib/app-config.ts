import { AppConfig, AppConfigSchema } from "./config-schema";
import { DEFAULT_CONFIG } from "./default-config";

export const APP_CONFIG: AppConfig = AppConfigSchema.parse(DEFAULT_CONFIG);

export function getAppConfig(): AppConfig {
    return APP_CONFIG;
}
