import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "./admin-layout-shell";

async function handleLogout() {
    "use server";
    await logout();
    redirect("/admin/login");
}

import { getAppConfig } from "@/lib/config-server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const config = await getAppConfig();

    return (
        <AdminLayoutShell logoutAction={handleLogout} config={config}>
            {children}
        </AdminLayoutShell>
    );
}
