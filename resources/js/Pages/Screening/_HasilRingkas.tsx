import React from "react";
import { router } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { Heart, RefreshCw } from "lucide-react";
import { ScreeningInput, ScreeningResult } from "@/types/screening";

interface HasilRingkasProps {
  screeningResult: ScreeningResult;
  formData: ScreeningInput;
  gestationalInfo: { weeks: number; days: number; dueDate?: string; formattedAge: string };
  setRightPanelView: (view: "summary" | "detail") => void;
  handleRescreen: () => void;
}

export function HasilRingkas({
  screeningResult,
  formData,
  gestationalInfo,
  setRightPanelView,
  handleRescreen,
}: HasilRingkasProps) {
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
      {/* Top Level Risiko Card */}
      <Card className="border border-slate-200/80 shadow-soft-sm bg-white rounded-3xl p-5 sm:p-6 space-y-3.5 text-center">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Level risiko Ibu Hamil, <span className="font-semibold text-slate-700">{formData.umur || 27} thn</span>
          </p>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-1.5 ${risikoColor}`}>
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

        <p className="text-xs font-semibold text-slate-600">
          Skor KSPR: <strong className="text-slate-900 font-bold">{score} Poin</strong>
          {(gestationalInfo.weeks > 0 || gestationalInfo.days > 0) && ` · Usia Hamil: ${gestationalInfo.formattedAge}`}
        </p>

        {/* Action links */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => setRightPanelView("detail")}
            className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Lihat Perhitungan &rarr;
          </button>
          <button
            type="button"
            onClick={handleRescreen}
            className="font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Cek Ulang</span>
          </button>
        </div>
      </Card>

      {/* Card 1: Rekomendasi Tempat & Penolong Persalinan */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-xs space-y-1">
        <h4 className="font-bold text-rose-700 text-xs sm:text-sm">
          Rekomendasi Tempat &amp; Penolong Persalinan
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
          {screeningResult.rekomendasi_faskes || "Puskesmas Rawat Inap / PONED (Bidan & Dokter Umum)"}
        </p>
      </div>

      {/* Card 2: Rincian Faktor Risiko Terdeteksi */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
          Rincian Faktor Risiko Terdeteksi:
        </h4>
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
        </div>
      </div>

      {/* Card 3: Saran Terapi Komplementer */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs sm:text-sm">
          <Heart className="h-4 w-4" />
          <span>Saran Terapi Komplementer</span>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="oxytocin" className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs">
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
              Pijat Oxytocin Tulang Belakang (Bantuan Suami)
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
              Metode aman non-farmakologi untuk meredakan ketegangan dan mengoptimalkan kondisi fisik serta relaksasi ibu hamil.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="senam" className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs">
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
              Senam Pelenturan Panggul Trimester 3
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
              Gerakan peregangan sendi panggul ringan untuk mempersiapkan jalan lahir dan kenyamanan posisi tidur Bunda.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="air" className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs">
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
              Minum Air Putih Cukup (8-10 Gelas/Hari)
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
              Menjaga sirkulasi cairan tubuh, volume air ketuban optimal, dan mencegah dehidrasi serta kram otot.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
