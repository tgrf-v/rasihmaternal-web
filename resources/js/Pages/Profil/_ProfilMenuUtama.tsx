import React from "react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import {
  User as UserIcon,
  ChevronRight,
  Baby,
  ShieldCheck,
  BookOpen,
  Info,
  FileText,
  HelpCircle,
  LogOut,
  Lock,
} from "lucide-react";
import { User } from "@/types";

interface ProfilMenuUtamaProps {
  user: User;
  onNavigate: (view: "edit_profil" | "riwayat" | "syarat" | "privasi" | "bantuan" | "ganti_password") => void;
  onOpenLogoutModal: () => void;
}

export function ProfilMenuUtama({
  user,
  onNavigate,
  onOpenLogoutModal,
}: ProfilMenuUtamaProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Profile Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 pt-2 pb-4">
        {/* Profile Avatar Image */}
        <div
          onClick={() => onNavigate("edit_profil")}
          className="relative group cursor-pointer"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-soft-md bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-105 transition-all">
            {user.foto_profil ? (
              <img
                src={user.foto_profil}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="h-12 w-12 sm:h-14 sm:w-14 text-slate-600" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-rose-600 text-white shadow-soft-sm group-hover:scale-110 transition-transform">
            <UserIcon className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Name & Chevron Clickable to Edit Data Diri */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onNavigate("edit_profil")}
            className="group inline-flex items-center gap-1.5 text-lg sm:text-xl font-bold text-slate-900 hover:text-rose-600 transition-colors"
          >
            <span>{user.name}</span>
            <ChevronRight className="h-5 w-5 text-slate-800 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {user.role === "superadmin"
              ? "Superadmin Kebidanan"
              : user.role === "bidan"
              ? "Bidan Faskes Wilayah"
              : "Ibu Hamil / Pasien Terdaftar"}
          </p>
        </div>
      </div>

      {/* Menu 1: Single Riwayat Card */}
      <Card
        onClick={() => onNavigate("riwayat")}
        className="rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Baby className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
              Riwayat Skrining
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
        </div>
      </Card>

      {/* Menu Superadmin: Panel Kelola (Khusus Mobile) */}
      {user?.role === "superadmin" && (
        <Card className="md:hidden rounded-3xl border border-rose-100/90 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] divide-y divide-slate-100 overflow-hidden space-y-0">
          <div className="px-4 py-2.5 bg-rose-50/70 flex items-center justify-between border-b border-rose-100/70">
            <span className="text-xs font-bold text-rose-700 tracking-wide">Panel Superadmin</span>
            <span className="text-[10px] font-bold text-rose-600 bg-white px-2.5 py-0.5 rounded-full border border-rose-200/80 shadow-soft-xs">
              Khusus Dosen / Admin
            </span>
          </div>

          {/* Kelola Bidan */}
          <Link
            href="/admin/bidan"
            className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                  Kelola Bidan
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Manajemen Akun &amp; Nakes Wilayah
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Kelola Kamus & Video Terapi */}
          <Link
            href="/admin/kamus"
            className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                  Kelola Kamus
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Istilah Medis &amp; Video Terapi
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </Card>
      )}

      {/* Menu 2: Grouped Menu Box Card */}
      <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] divide-y divide-slate-100 overflow-hidden space-y-0">
        {/* Row 1: Ubah Kata Sandi */}
        <div
          onClick={() => onNavigate("ganti_password")}
          className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Lock className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                Ubah Kata Sandi
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Ganti kata sandi demi keamanan akun
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Row 2: Tentang Kami */}
        <Link
          href="/tentang-kami"
          className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Info className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
              Tentang Kami
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Row 2: Syarat dan Ketentuan */}
        <div
          onClick={() => onNavigate("syarat")}
          className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
              Syarat dan Ketentuan
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Row 3: Kebijakan Privasi */}
        <div
          onClick={() => onNavigate("privasi")}
          className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
              Kebijakan Privasi
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Row 4: Bantuan */}
        <div
          onClick={() => onNavigate("bantuan")}
          className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HelpCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
              Bantuan
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Logout Button Row */}
        <div
          onClick={onOpenLogoutModal}
          className="p-4 sm:p-5 bg-rose-50/40 hover:bg-rose-100/60 transition-colors cursor-pointer flex items-center justify-between text-rose-600 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <LogOut className="h-5 w-5 text-rose-600" />
            </div>
            <span className="font-bold text-sm sm:text-base">
              Keluar / Logout Akun
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-rose-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </div>
  );
}
