import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "./admin-layout-shell";

async function handleLogout() {
    "use server";
    await logout();
    redirect("/admin/login");
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminLayoutShell logoutAction={handleLogout}>
            {children}
        </AdminLayoutShell>
    );
}
