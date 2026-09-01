import React, { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  Activity,
  BookOpen,
  User,
  Home,
  Sparkles,
  LogOut,
  LogIn,
  Stethoscope,
  Globe,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { GlobalSearch } from "@/Components/GlobalSearch";
import { MobileBottomNav } from "@/Components/MobileBottomNav";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";

import { PageProps } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  activeNav?: "landing" | "beranda" | "kehamilan" | "persalinan" | "partograf" | "kamus" | "profil" | "tentang-kami" | "admin-bidan" | "admin-kamus";
}

export const BundaSehatLayout: React.FC<LayoutProps> = ({
  children,
  activeNav = "beranda",
}) => {
  const { auth } = usePage<PageProps>().props;
  const { url } = usePage();

  const user = auth?.user;
  const isLoggedIn = Boolean(user);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [language, setLanguage] = useState<"ID" | "EN">("ID");

  const getEffectiveNav = (currentUrl: string, propNav?: string) => {
    if (propNav) return propNav;
    if (currentUrl.startsWith('/screening/kehamilan')) return 'kehamilan';
    if (currentUrl.startsWith('/screening/persalinan')) return 'persalinan';
    if (currentUrl.startsWith('/screening/hasil')) return 'kehamilan';
    if (currentUrl.startsWith('/partograf')) return 'partograf';
    if (currentUrl.startsWith('/kamus')) return 'kamus';
    if (currentUrl.startsWith('/profil')) return 'profil';
    if (currentUrl.startsWith('/tentang-kami')) return 'tentang-kami';
    if (currentUrl.startsWith('/admin/bidan')) return 'admin-bidan';
    if (currentUrl.startsWith('/admin/kamus')) return 'admin-kamus';
    if (currentUrl === '/' || currentUrl === '') return 'beranda';
    return 'beranda';
  };

  const currentNav = getEffectiveNav(url, activeNav);
  const isScreeningActive = currentNav === "kehamilan" || currentNav === "persalinan";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-x-clip lg:overflow-y-hidden">

      {/* Background Soft Natural Tint matching Design Preview */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden">
        {/* Soft Warm Rose Ambient on Top Right */}
        <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-gradient-to-br from-rose-100/40 via-pink-50/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        {/* Subtle Soft Tint on Left Bottom */}
        <div className="absolute -left-20 bottom-10 w-[500px] h-[500px] bg-gradient-to-tr from-rose-50/30 via-slate-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Header Desktop (Fixed Top Navbar) */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 print:hidden ${
          !isLoggedIn && !isScrolled
            ? "bg-transparent border-transparent shadow-none text-white"
            : "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-soft-xs text-slate-900"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex md:grid md:grid-cols-[auto_1fr_auto] items-center justify-between md:justify-normal gap-4">
          
          {/* Ujung Kiri (Anchor): Logo Brand */}
          <div className="flex items-center shrink-0">
            <Link href={isLoggedIn ? "/" : "/login"} prefetch className="flex items-center gap-2.5 group shrink-0">
              <ApplicationLogo
                variant={!isLoggedIn && !isScrolled ? "white" : "color"}
                className="h-8 w-8 group-hover:scale-105 transition-transform"
              />
              <span
                className={`font-bold text-base tracking-wide transition-colors ${
                  !isLoggedIn && !isScrolled ? "text-white" : "text-slate-800"
                }`}
              >
                RASIH Maternal
              </span>
            </Link>
          </div>

          {/* Tengah (Center Group): Search Bar + Menu Navigasi */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center justify-center gap-3 lg:gap-5 w-full">
              {/* Global Search Bar Component (Lebar Kompak 230-260px) */}
              <div className="w-52 sm:w-56 md:w-60 lg:w-64 shrink-0">
                <GlobalSearch />
              </div>

              {/* Navigasi Desktop */}
              <nav className="flex items-center gap-1">
                <Link
                  href="/"
                  prefetch
                  className={`px-3 py-1.5 text-sm transition-colors rounded-full ${
                    currentNav === "beranda"
                      ? "text-emerald-700 font-bold"
                      : "text-slate-600 font-medium hover:text-slate-900"
                  }`}
                >
                  Beranda
                </Link>

                {/* Dropdown Menu: Screening */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`px-3 py-1.5 text-sm transition-colors rounded-full inline-flex items-center gap-1 cursor-pointer ${
                      isScreeningActive
                        ? "text-emerald-700 font-bold"
                        : "text-slate-600 font-medium hover:text-slate-900"
                    }`}
                  >
                    <span>Screening</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 p-1.5 rounded-2xl bg-white border border-slate-100/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <DropdownMenuItem onClick={() => router.visit("/screening/kehamilan")} className="p-2.5 rounded-xl hover:bg-slate-50">
                      <div className="flex items-center gap-2.5 w-full">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-xs text-slate-800">Screening Kehamilan</span>
                          <span className="text-[10px] text-slate-500">Cek Risiko Trimester</span>
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.visit("/screening/persalinan")} className="p-2.5 rounded-xl hover:bg-slate-50 mt-0.5">
                      <div className="flex items-center gap-2.5 w-full">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Stethoscope className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-xs text-slate-800">Screening Persalinan</span>
                          <span className="text-[10px] text-slate-500">Kesiapan Bersalin</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/partograf"
                  prefetch
                  className={`px-3 py-1.5 text-sm transition-colors rounded-full ${
                    currentNav === "partograf"
                      ? "text-emerald-700 font-bold"
                      : "text-slate-600 font-medium hover:text-slate-900"
                  }`}
                >
                  Partograf
                </Link>

                <Link
                  href="/kamus"
                  prefetch
                  className={`px-3 py-1.5 text-sm transition-colors rounded-full ${
                    currentNav === "kamus"
                      ? "text-emerald-700 font-bold"
                      : "text-slate-600 font-medium hover:text-slate-900"
                  }`}
                >
                  Kamus Kesehatan
                </Link>
                <Link
                  href="/tentang-kami"
                  prefetch
                  className={`px-3 py-1.5 text-sm transition-colors rounded-full ${
                    currentNav === "tentang-kami"
                      ? "text-emerald-700 font-bold"
                      : "text-slate-600 font-medium hover:text-slate-900"
                  }`}
                >
                  Tentang Kami
                </Link>

                {/* Dropdown Menu: Admin (Superadmin) */}
                {user?.role === "superadmin" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`px-3 py-1.5 text-sm transition-colors rounded-full inline-flex items-center gap-1 cursor-pointer ${
                        currentNav === "admin-bidan" || currentNav === "admin-kamus"
                          ? "text-emerald-700 font-bold"
                          : "text-slate-600 font-medium hover:text-slate-900"
                      }`}
                    >
                      <span>Admin</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl bg-white border border-slate-100/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                      <DropdownMenuItem onClick={() => router.visit("/admin/bidan")} className="p-2.5 rounded-xl hover:bg-slate-50">
                        <div className="flex items-center gap-2.5 w-full">
                          <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-xs text-slate-800">Kelola Bidan</span>
                            <span className="text-[10px] text-slate-500">Manajemen Nakes Wilayah</span>
                          </div>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => router.visit("/admin/kamus")} className="p-2.5 rounded-xl hover:bg-slate-50 mt-0.5">
                        <div className="flex items-center gap-2.5 w-full">
                          <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-xs text-slate-800">Kelola Kamus</span>
                            <span className="text-[10px] text-slate-500">Istilah &amp; Video Terapi</span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </nav>
            </div>
          )}

          {/* Ujung Kanan (Anchor): User Profile Avatar */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center justify-end shrink-0">
              <Link
                href="/profil"
                prefetch
                className="relative group p-0.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all shadow-soft-xs flex items-center justify-center"
                title={`Profil Saya (${user?.name || "User"})`}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-soft-xs group-hover:scale-105 transition-transform bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  {user?.foto_profil ? (
                    <img
                      src={user.foto_profil}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-slate-600" />
                  )}
                </div>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24 md:pb-0 print:p-0 print:pt-0">{children}</main>

      {/* Mobile Floating Curved Bottom Navigation Bar */}
      {isLoggedIn && <MobileBottomNav activeNav={currentNav} />}

      {/* Footer Edukatif (Hanya Tampil Pada Landing Page Sebelum Login) */}
      {!isLoggedIn && (
        <footer className="bg-white border-t border-slate-100 py-8 px-4 mt-auto hidden md:block print:hidden">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ApplicationLogo className="h-5 w-5" />
              <span className="font-semibold text-slate-700">
                RASIH Maternal &copy; {new Date().getFullYear()}
              </span>
              <span>- Risk Assessment and Screening for Integrated Maternal Health</span>
            </div>
            <div className="flex items-center gap-4 font-medium">
              <Link href="/#fitur" className="hover:text-rose-600">
                Fitur Unggulan
              </Link>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
};
