import React from "react";
import { Link } from "@inertiajs/react";
import {
  Activity,
  Stethoscope,
  BookOpen,
  User,
  ChevronRight,
} from "lucide-react";

export function BerandaLayananSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left Side: Title & Description */}
      <div className="lg:col-span-5 space-y-2.5 pt-1">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
          Layanan Utama <span className="text-rose-600">Aplikasi</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
          Akses cepat layanan screening kehamilan, kesiapan persalinan, serta edukasi kesehatan kebidanan secara terintegrasi.
        </p>
      </div>

      {/* Right Side: Feature Cards Grid */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4">
        {/* Shortcut 1: Screening Kehamilan */}
        <Link
          href="/screening/kehamilan"
          prefetch
          className="p-3.5 pl-4 pr-5 md:p-4 md:pl-5 md:pr-6 rounded-full bg-white border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/80 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                Screening Kehamilan
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Cek Risiko Trimester
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        {/* Shortcut 2: Screening Persalinan */}
        <Link
          href="/screening/persalinan"
          prefetch
          className="p-3.5 pl-4 pr-5 md:p-4 md:pl-5 md:pr-6 rounded-full bg-white border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/80 group-hover:scale-105 transition-transform shrink-0">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                Screening Persalinan
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Kesiapan Bersalin
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        {/* Shortcut 3: Kamus Kesehatan */}
        <Link
          href="/kamus"
          prefetch
          className="p-3.5 pl-4 pr-5 md:p-4 md:pl-5 md:pr-6 rounded-full bg-white border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/80 group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                Kamus Kesehatan
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Edukasi &amp; Terapi Video
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>

        {/* Shortcut 4: Profil Saya */}
        <Link
          href="/profil"
          prefetch
          className="p-3.5 pl-4 pr-5 md:p-4 md:pl-5 md:pr-6 rounded-full bg-white border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/80 group-hover:scale-105 transition-transform shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                Profil Saya
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Riwayat Screening
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Link>
      </div>
    </section>
  );
}
