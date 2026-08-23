import React from "react";
import { Card } from "@/Components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { RefreshCw, Heart } from "lucide-react";
import { PersalinanFormData } from "./_FormPersalinanStep1";
import { PenapisanItem } from "./_FormPersalinanStep2";

interface HasilPersalinanRingkasProps {
  formData: PersalinanFormData;
  isGawatDarurat: boolean;
  positiveFactors: PenapisanItem[];
  onViewDetail: () => void;
  onRescreen: () => void;
}

export function HasilPersalinanRingkas({
  formData,
  isGawatDarurat,
  positiveFactors,
  onViewDetail,
  onRescreen,
}: HasilPersalinanRingkasProps) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <Card className="border border-slate-200/90 shadow-soft-xs bg-white rounded-3xl p-5 sm:p-6 space-y-3.5 text-center">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Hasil Penapisan Pasien:{" "}
            <span className="font-semibold text-slate-700">
              {formData.nama_pasien} ({formData.umur} thn)
            </span>
          </p>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
              isGawatDarurat ? "text-rose-600" : "text-emerald-700"
            }`}
          >
            {isGawatDarurat
              ? "Komplikasi Gawat Darurat"
              : "Persalinan Fisiologis (Normal)"}
          </h2>
        </div>

        {/* Tri-Color Segmented Indicator */}
        <div className="relative w-full max-w-sm mx-auto pt-2 pb-6">
          <div className="h-4 w-full rounded-full flex overflow-hidden">
            <div className="flex-1 bg-[#64B565]" />
            <div className="flex-1 bg-[#F7D154]" />
            <div className="flex-1 bg-[#F83838]" />
          </div>
          <div
            className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
            style={{ left: isGawatDarurat ? "85%" : "15%" }}
          >
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
            <div className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
              {isGawatDarurat ? "Wajib Rujuk" : "Normal"}
            </div>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-600">
          Total Indikator Bahaya:{" "}
          <strong
            className={
              isGawatDarurat
                ? "text-rose-600 font-bold"
                : "text-emerald-700 font-bold"
            }
          >
            {positiveFactors.length} dari 19 Parameter
          </strong>
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={onViewDetail}
            className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Lihat Rincian Penapisan &rarr;
          </button>
          <button
            type="button"
            onClick={onRescreen}
            className="font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Cek Ulang</span>
          </button>
        </div>
      </Card>

      {/* Card Rekomendasi Tempat & Penolong */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-xs space-y-1">
        <h4 className="font-bold text-rose-700 text-xs sm:text-sm">
          Rekomendasi Tempat &amp; Penolong Persalinan
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
          {isGawatDarurat
            ? "Wajib segera dirujuk dan bersalin di Rumah Sakit dengan fasilitas PONEK 24 Jam bersama Dokter Spesialis Kebidanan & Kandungan (Sp.OG)."
            : "Dianjurkan bersalin di Praktek Mandiri Bidan (PMB) atau Puskesmas PONED bersama Bidan dan Dokter Umum."}
        </p>
      </div>

      {/* Rincian Faktor Bahaya Terdeteksi */}
      {isGawatDarurat && (
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
            Indikator Bahaya yang Terdeteksi:
          </h4>
          <div className="space-y-2">
            {positiveFactors.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-rose-200/90 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm"
              >
                <span className="font-medium text-slate-800">
                  {item.no}. {item.label}
                </span>
                <span className="font-bold text-rose-600 shrink-0">Bahaya</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saran Terapi Komplementer Persalinan */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs sm:text-sm">
          <Heart className="h-4 w-4" />
          <span>Saran Asuhan &amp; Terapi Komplementer Persalinan</span>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem
            value="terapi-1"
            className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs"
          >
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
              Pijat Punggung (Endorphin Massage) &amp; Relaksasi Napas
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
              Membantu mengurangi rasa nyeri kala I fase aktif, memicu pelepasan hormon endorfin alami, dan mempercepat pembukaan serviks secara nyaman.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="terapi-2"
            className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs"
          >
            <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
              Pijat Oksitosin &amp; Kompres Hangat
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
              Memperbaiki efektivitas his / kontraksi rahim secara alami dan memberikan rasa tenang pada ibu bersalin.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
