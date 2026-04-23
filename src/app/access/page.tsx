import { getAppConfig } from "@/lib/app-config";
import { isAccessProtectionEnabled, sanitizeAccessRedirectTarget } from "@/lib/access-control";
import { getLocalized } from "@/lib/i18n-utils";
import { AccessGateScreen } from "@/components/public/access-gate-screen";

export default async function AccessPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const config = await getAppConfig();

    return (
        <AccessGateScreen
            nextPath={sanitizeAccessRedirectTarget(resolvedSearchParams.next)}
            protectionEnabled={isAccessProtectionEnabled()}
            brandTitle={getLocalized(config.header?.title, "it") || "Garfagnanafoto.it"}
            logoSrc={config.header?.logo?.src || "/images/logo.png"}
        />
    );
}
