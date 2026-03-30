"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MapPin,
    Settings,
    Menu,
    X,
    Radio,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
    name: string;
    icon: LucideIcon;
    href: string;
};

const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Giám sát", icon: MapPin, href: "/tracking" },
    { name: "Quản lý", icon: Settings, href: "/manage-devices" },
];

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const pathname = usePathname();

    // Full screen for Tracking page
    if (pathname === "/tracking") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#0a0e14]">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Radio className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="font-bold text-white text-lg tracking-tight">
                                TrackHub
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-green-500/10 text-green-400"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile toggle */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-[#0d1117] px-4 py-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-green-500/10 text-green-400"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* Page Content */}
            {children}
        </div>
    );
}