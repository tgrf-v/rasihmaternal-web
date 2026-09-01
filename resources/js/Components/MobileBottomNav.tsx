import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Home,
    Activity,
    Stethoscope,
    BookOpen,
    User,
    LucideIcon,
} from 'lucide-react';

interface NavItem {
    key: string;
    label: string;
    href: string;
    icon: LucideIcon;
    match: (activeNav: string) => boolean;
}

interface MobileBottomNavProps {
    activeNav?: string;
}

const NAV_ITEMS: NavItem[] = [
    {
        key: 'beranda',
        label: 'Beranda',
        href: '/',
        icon: Home,
        match: (nav) => nav === 'beranda' || nav === 'landing',
    },
    {
        key: 'kehamilan',
        label: 'Kehamilan',
        href: '/screening/kehamilan',
        icon: Activity,
        match: (nav) => nav === 'kehamilan',
    },
    {
        key: 'persalinan',
        label: 'Persalinan',
        href: '/screening/persalinan',
        icon: Stethoscope,
        match: (nav) => nav === 'persalinan' || nav === 'partograf',
    },
    {
        key: 'kamus',
        label: 'Kamus',
        href: '/kamus',
        icon: BookOpen,
        match: (nav) => nav === 'kamus' || nav === 'admin-kamus',
    },
    {
        key: 'profil',
        label: 'Profil',
        href: '/profil',
        icon: User,
        match: (nav) => nav === 'profil' || nav === 'admin-bidan',
    },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeNav = 'beranda' }) => {
    return (
        <nav
            aria-label="Navigasi Seluler"
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden"
        >
            <div className="grid grid-cols-5 max-w-md mx-auto relative px-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = item.match(activeNav);
                    const Icon = item.icon;

                    return (
                        <div key={item.key} className="relative flex justify-center py-2 min-h-[58px]">
                            {isActive ? (
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex flex-col items-center justify-end w-full group relative focus:outline-none"
                                >
                                    {/* Curved Notch Cutout Background (SVG Wings) */}
                                    <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 w-[74px] h-[22px] pointer-events-none flex items-center justify-center">
                                        <svg
                                            viewBox="0 0 74 22"
                                            className="w-full h-full text-white fill-current"
                                        >
                                            {/* Scooped Cutout curve */}
                                            <path d="M 0,22 C 14,22 18,2 37,2 C 56,2 60,22 74,22 Z" />
                                        </svg>
                                    </div>

                                    {/* Floating Elevated Active Button */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-1 rounded-full bg-slate-50/90 backdrop-blur-xs">
                                        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-2 ring-white transition-all transform group-active:scale-95">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Active Item Label */}
                                    <span className="text-[10px] font-bold text-emerald-700 mt-5 pt-1.5 transition-colors">
                                        {item.label}
                                    </span>
                                </Link>
                            ) : (
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex flex-col items-center justify-center w-full py-1 text-slate-400 hover:text-slate-700 transition-colors group focus:outline-none"
                                >
                                    <Icon className="w-5 h-5 mb-1 transition-transform group-hover:scale-110" />
                                    <span className="text-[10px] font-medium transition-colors">
                                        {item.label}
                                    </span>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
};
