import { getAppConfig } from "@/lib/config-server";
import { WizardContainer } from "@/components/custom-flow/wizard-container";

export default async function CustomPage() {
    const config = await getAppConfig();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <WizardContainer config={config} />
        </div>
    );
}
