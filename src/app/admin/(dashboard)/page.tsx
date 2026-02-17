import { getAppConfig } from "@/lib/config-server";
import { ConfigEditor } from "@/components/admin/config-editor";

export const revalidate = 0;

export default async function AdminDashboard() {
    const config = await getAppConfig();

    return (
        <div className="space-y-6">
            <ConfigEditor initialConfig={config} />
        </div>
    );
}
