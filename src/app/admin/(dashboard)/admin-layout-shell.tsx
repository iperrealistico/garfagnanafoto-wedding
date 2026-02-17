"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AdminSidebar, ADMIN_SECTIONS } from "@/components/admin/admin-sidebar";
import { Toaster } from "sonner";
import { AppConfig } from "@/lib/config-schema";

interface AdminLayoutShellProps {
    children: React.ReactNode;
    logoutAction: () => Promise<void>;
    config: AppConfig;
}

export function AdminLayoutShell({ children, logoutAction, config }: AdminLayoutShellProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Default to first section if none specified
    const activeSection = searchParams.get("section") || ADMIN_SECTIONS[0].id;

    const handleSectionChange = (section: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("section", section);
        router.push(`${pathname}?${params.toString()}`);
    };

    const sectionLabel = ADMIN_SECTIONS.find(s => s.id === activeSection)?.label || "Dashboard";

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#f7f7f7]">
            <Toaster position="top-right" richColors />

            <AdminSidebar
                config={config}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                logoutAction={logoutAction}
            />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{sectionLabel}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Live System
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
