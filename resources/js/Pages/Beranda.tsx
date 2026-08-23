import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
  Activity,
  BookOpen,
  User,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Plus,
  Info,
} from "lucide-react";
import { ScreeningResult } from "@/types/screening";

import { PageProps } from "@/types";

type BerandaPageProps = PageProps<{
  latestScreening: ScreeningResult | null;
}>;

export default function Beranda() {
  const { latestScreening, auth } = usePage<BerandaPageProps>().props;
  const screeningResult = latestScreening;

  return (
    <BundaSehatLayout activeNav="beranda">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8">
        


        {/* SECTION 1: LAYANAN KAMI (HALODOC SIDE-BY-SIDE STYLE) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Side: Title & Description (Rata Atas) */}
          <div className="lg:col-span-5 space-y-2.5 pt-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              Layanan Utama <span className="text-rose-600">Aplikasi</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              Akses cepat layanan screening kehamilan, kesiapan persalinan, serta edukasi kesehatan kebidanan secara terintegrasi.
            </p>
          </div>

          {/* Right Side: Feature Cards Grid (Compact Width) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4">
            
            {/* Shortcut 1: Screening Kehamilan */}
            <Link
              href="/screening/kehamilan"
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

        {/* SECTION 2: DATA PROGRESS ATAU HASIL SCREENING TERAKHIR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Data Screening Kehamilan Anda
            </h2>

            {screeningResult && (
              <Link
                href="/screening/kehamilan"
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Screening Ulang</span>
              </Link>
            )}
          </div>

          {!screeningResult ? (
            /* EMPTY STATE: BELUM ADA DATA SCREENING */
            <Card className="p-8 border border-slate-100 bg-white text-center rounded-3xl space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8" />
              </div>
              
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-bold text-slate-900 text-base">Belum Ada Data Screening Kehamilan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lakukan screening fisik dan tensi darah pertama Anda untuk mengetahui tingkat risiko komplikasi dan panduan kesehatan.
                </p>
              </div>

              <Link
                href="/screening/kehamilan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white font-bold text-xs shadow-soft-sm hover:bg-rose-700 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Mulai Screening Sekarang</span>
              </Link>
            </Card>
          ) : (
            /* FILLED STATE: HASIL SCREENING TERAKHIR (SOLID WHITE CARD) */
            <Card className="w-full rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.09)] transition-all bg-white overflow-hidden space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[280px]">
                
                {/* Left Side: Image with Ultra Smooth Fade Gradient Overlay into White Content */}
                <div
                  className="md:col-span-5 relative h-56 md:h-auto w-full bg-cover bg-center overflow-hidden min-h-[240px]"
                  style={{ backgroundImage: "url('/images/screening-banner.webp')" }}
                >
                  {/* Floating Tag Overlay */}
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide shadow-md">
                    Hasil Skrining Terakhir
                  </div>

                  {/* Smooth Fade Transition into White Content */}
                  <div
                    className="hidden md:block absolute inset-y-0 right-0 w-1/3 pointer-events-none z-10"
                    style={{
                      background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.7) 60%, #ffffff 100%)",
                    }}
                  />
                  <div
                    className="md:hidden absolute inset-x-0 bottom-0 h-24 pointer-events-none z-10"
                    style={{
                      background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 60%, #ffffff 100%)",
                    }}
                  />
                </div>

                {/* Right Side: Screening Results Details (Centered Layout) */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white text-center">
                  <div className="space-y-4 text-center flex flex-col items-center justify-center">
                    {/* Header Context */}
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-500">
                        Tingkat Risiko Ibu Hamil • HPL: <span className="font-bold text-slate-700">{screeningResult.taksiran_hpl || "19 Juli 2026"}</span>
                      </p>
                      {/* Judul Risiko */}
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-amber-600">
                        {screeningResult.status_label || "Risiko Tinggi / Sedang"}
                      </h2>
                    </div>

                    {/* Tri-Color Segmented Risk Gauge Meter with Floating Score Pin */}
                    <div className="relative w-full max-w-md mx-auto pt-2 pb-7">
                      <div className="h-4 sm:h-5 w-full rounded-full flex overflow-hidden">
                        <div className="flex-1 bg-[#64B565]" />
                        <div className="flex-1 bg-[#F7D154]" />
                        <div className="flex-1 bg-[#F83838]" />
                      </div>

                      {/* Floating Black Score Pin Pointer */}
                      {(() => {
                        const score = screeningResult.total_skor || 10;
                        const percent = Math.min(Math.max((score / 20) * 100, 8), 92);
                        return (
                          <div
                            className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
                            style={{ left: `${percent}%` }}
                          >
                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
                            <div className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                              {score}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Deskripsi Rekomendasi */}
                    <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
                      Rekomendasi Penolong: <strong className="font-bold text-slate-800">{screeningResult.rekomendasi_tempat || "Puskesmas Rawat Inap / PONED"} {screeningResult.penolong_persalinan ? `(${screeningResult.penolong_persalinan})` : "(Bidan & Dokter Umum)"}</strong>
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <Link
                      href={screeningResult.id ? `/screening/${screeningResult.id}` : "/screening/kehamilan"}
                      className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      Lihat Detail Hasil
                    </Link>

                    <Link
                      href="/screening/kehamilan"
                      className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Screening Ulang</span>
                    </Link>
                  </div>
                </div>

              </div>
            </Card>
          )}
        </section>

      </div>
    </BundaSehatLayout>
  );
}
