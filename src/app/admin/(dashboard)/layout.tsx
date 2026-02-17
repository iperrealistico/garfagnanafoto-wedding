import { logout, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "./admin-layout-shell";
import { getAppConfig } from "@/lib/config-server";

async function handleLogout() {
    "use server";
    await logout();
    redirect("/admin/login");
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) {
        redirect("/admin/login");
    }

    const config = await getAppConfig();

    return (
        <AdminLayoutShell logoutAction={handleLogout} config={config}>
            {children}
        </AdminLayoutShell>
    );
}
