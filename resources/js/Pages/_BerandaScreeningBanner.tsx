import React from "react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import { Activity, Plus, RefreshCw } from "lucide-react";
import { ScreeningResult } from "@/types/screening";

interface BerandaScreeningBannerProps {
  screeningResult: ScreeningResult | null;
}

export function BerandaScreeningBanner({
  screeningResult,
}: BerandaScreeningBannerProps) {
  return (
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
            <h3 className="font-bold text-slate-900 text-base">
              Belum Ada Data Screening Kehamilan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lakukan screening fisik dan tensi darah pertama Anda untuk
              mengetahui tingkat risiko komplikasi dan panduan kesehatan.
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
            {/* Left Side: Image with Ultra Smooth Fade Gradient Overlay */}
            <div
              className="md:col-span-5 relative h-56 md:h-auto w-full bg-cover bg-center overflow-hidden min-h-[240px]"
              style={{
                backgroundImage: "url('/images/screening-banner.webp')",
              }}
            >
              {/* Floating Tag Overlay */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide shadow-md">
                Hasil Skrining Terakhir
              </div>

              {/* Smooth Fade Transition into White Content */}
              <div
                className="hidden md:block absolute inset-y-0 right-0 w-1/3 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.7) 60%, #ffffff 100%)",
                }}
              />
              <div
                className="md:hidden absolute inset-x-0 bottom-0 h-24 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 60%, #ffffff 100%)",
                }}
              />
            </div>

            {/* Right Side: Screening Results Details (Centered Layout) */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white text-center">
              <div className="space-y-4 text-center flex flex-col items-center justify-center">
                {/* Header Context */}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">
                    Tingkat Risiko Ibu Hamil • HPL:{" "}
                    <span className="font-bold text-slate-700">
                      {screeningResult.taksiran_hpl || "19 Juli 2026"}
                    </span>
                  </p>
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

                  {(() => {
                    const score = screeningResult.total_skor || 10;
                    const percent = Math.min(
                      Math.max((score / 20) * 100, 8),
                      92
                    );
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

                <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
                  Rekomendasi Penolong:{" "}
                  <strong className="font-bold text-slate-800">
                    {screeningResult.rekomendasi_tempat ||
                      "Puskesmas Rawat Inap / PONED"}{" "}
                    {screeningResult.penolong_persalinan
                      ? `(${screeningResult.penolong_persalinan})`
                      : "(Bidan & Dokter Umum)"}
                  </strong>
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <Link
                  href={
                    screeningResult.id
                      ? `/screening/${screeningResult.id}`
                      : "/screening/kehamilan"
                  }
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
  );
}
