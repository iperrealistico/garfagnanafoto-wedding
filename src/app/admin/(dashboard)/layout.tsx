import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white px-6 py-4 shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">Garfagnanafoto Admin</h1>
                    <nav className="flex items-center space-x-4">
                        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900" target="_blank">
                            View Site
                        </Link>
                        <form action={handleLogout}>
                            <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800">
                                Logout
                            </button>
                        </form>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
