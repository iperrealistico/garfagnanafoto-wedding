"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Palette,
    Image as ImageIcon,
    Type,
    Star,
    Box,
    Settings,
    Globe,
    Github,
    Menu,
    X,
    LogOut,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
    onSectionChange?: (section: string) => void;
    activeSection?: string;
    logoutAction: () => Promise<void>;
}

export const ADMIN_SECTIONS = [
    { id: "branding", label: "Branding", icon: Palette },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "copy", label: "Hero & Footer", icon: Type },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "packages", label: "Packages", icon: Box },
    { id: "questions", label: "Questions", icon: Settings },
    { id: "legal", label: "Legal & SEO", icon: Globe },
    { id: "integrations", label: "Integrations", icon: Github },
];

export function AdminSidebar({ onSectionChange, activeSection, logoutAction }: AdminSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleItemClick = (id: string) => {
        onSectionChange?.(id);
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[#719436]">Admin</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {isOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b">
                        <h1 className="text-xl font-bold tracking-tight text-[#4c4c4c]">
                            Garfagnanafoto<span className="text-[#719436]">.</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">Admin Panel</p>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {ADMIN_SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => handleItemClick(section.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    activeSection === section.id
                                        ? "bg-[#719436] text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <section.icon className="w-4 h-4" />
                                {section.label}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t space-y-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Site
                        </Link>
                        <button
                            onClick={() => logoutAction()}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
