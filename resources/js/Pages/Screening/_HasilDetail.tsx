import React from "react";
import { router } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, Info, RefreshCw } from "lucide-react";
import { ScreeningInput, ScreeningResult } from "@/types/screening";

interface HasilDetailProps {
  screeningResult: ScreeningResult;
  formData: ScreeningInput;
  gestationalInfo: { weeks: number; days: number; dueDate?: string; formattedAge: string };
  setRightPanelView: (view: "summary" | "detail") => void;
  handleRescreen: () => void;
}

export function HasilDetail({
  screeningResult,
  formData,
  gestationalInfo,
  setRightPanelView,
  handleRescreen,
}: HasilDetailProps) {
  const score = screeningResult.total_skor || screeningResult.skor_poedji_rochjati || 2;
  const percent = Math.min(Math.max((score / 20) * 100, 8), 92);

  const risikoLabel =
    screeningResult.kategori_risiko === "KRR"
      ? "Kehamilan Risiko Rendah"
      : screeningResult.kategori_risiko === "KRT"
      ? "Kehamilan Risiko Tinggi"
      : "Kehamilan Risiko Sangat Tinggi";

  const risikoColor =
    screeningResult.kategori_risiko === "KRR"
      ? "text-emerald-700"
      : screeningResult.kategori_risiko === "KRT"
      ? "text-amber-600"
      : "text-rose-600";

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header back button */}
      <button
        type="button"
        onClick={() => setRightPanelView("summary")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors mb-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Kembali ke Hasil Ringkas</span>
      </button>

      {/* Card Top Level Risiko */}
      <Card className="border border-slate-200/80 shadow-soft-sm bg-white rounded-2xl p-5 space-y-4 text-center">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Level risiko Ibu Hamil, <span className="font-semibold text-slate-700">{formData.umur || 27} thn</span>
          </p>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1.5 ${risikoColor}`}>
            {risikoLabel}
          </h2>
        </div>

        {/* Tri-Color Segmented Gauge Bar */}
        <div className="relative w-full max-w-sm mx-auto pt-2 pb-6">
          <div className="h-4 w-full rounded-full flex overflow-hidden">
            <div className="flex-1 bg-[#64B565]" />
            <div className="flex-1 bg-[#F7D154]" />
            <div className="flex-1 bg-[#F83838]" />
          </div>
          <div
            className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
            style={{ left: `${percent}%` }}
          >
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
            <div className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
              {score}
            </div>
          </div>
        </div>
      </Card>

      {/* Banner Cyan Informasi & Cetak Laporan */}
      <div className="p-3.5 px-5 rounded-full bg-cyan-50 border border-cyan-100/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-900">
          <Info className="h-4 w-4 text-cyan-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">Gunakan laporan rincian perhitungan ini untuk referensi Anda.</span>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="font-bold text-cyan-700 hover:text-cyan-900 hover:underline shrink-0 text-xs"
        >
          Cetak
        </button>
      </div>

      {/* Section 1: Perhitungan Skor Risiko */}
      <div className="space-y-2.5 pt-1">
        <h4 className="font-bold text-slate-900 text-sm sm:text-base">Perhitungan skor risiko</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Gunakan perhitungan ini sebagai acuan Anda untuk mengantisipasi risiko komplikasi kehamilan.
        </p>
        <div className="space-y-2 pt-1">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
            <div className="h-4 w-4 rounded bg-[#64B565] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-xs sm:text-sm text-slate-900">Skor 2 - Risiko Rendah (KRR)</p>
              <p className="text-xs text-slate-500">Kehamilan fisiologis tanpa komplikasi terdeteksi.</p>
            </div>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
            <div className="h-4 w-4 rounded bg-[#F7D154] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-xs sm:text-sm text-slate-900">Skor 6-10 - Risiko Tinggi (KRT)</p>
              <p className="text-xs text-slate-500">Pengawasan rutin Bidan / Dokter umum Puskesmas.</p>
            </div>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
            <div className="h-4 w-4 rounded bg-[#F83838] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-xs sm:text-sm text-slate-900">Skor &ge; 12 - Risiko Sangat Tinggi (KRST)</p>
              <p className="text-xs text-slate-500">Rujukan ke Rumah Sakit &amp; Dokter Spesialis Kebidanan (SpOG).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Informasi Umum Pasien & Rincian Poin */}
      <div className="space-y-2.5 pt-2">
        <h4 className="font-bold text-slate-900 text-sm sm:text-base">Informasi umum</h4>
        <div className="divide-y divide-slate-100">
          {screeningResult.detail_skor && screeningResult.detail_skor.length > 0 ? (
            screeningResult.detail_skor.map((item, idx) => (
              <div key={idx} className="py-2.5 px-1 bg-white flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-slate-700">{item.deskripsi}</span>
                <span className="font-bold text-rose-600">+{item.skor} Poin</span>
              </div>
            ))
          ) : (
            <div className="py-2.5 px-1 bg-white flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium text-slate-700">Skor Awal Ibu Hamil (KSPR)</span>
              <span className="font-bold text-rose-600">+2 Poin</span>
            </div>
          )}
          <div className="py-2.5 px-1 bg-white flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-slate-700">Taksiran HPL</span>
            <span className="font-bold text-slate-900">
              {screeningResult.taksiran_hpl || gestationalInfo.dueDate || "Sesuai HPHT"}
            </span>
          </div>
        </div>
      </div>

      {/* Tombol Kembali / Rescreen */}
      <div className="pt-3 flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleRescreen}
          className="flex-1 rounded-full text-xs font-bold py-2.5"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          <span>Screening Ulang</span>
        </Button>
        <Button
          type="button"
          onClick={() => router.visit("/kamus")}
          className="flex-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5"
        >
          <span>Buka Kamus Terapi</span>
        </Button>
      </div>
    </div>
  );
}
