import React from "react";
import { Card } from "@/Components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { RefreshCw, Heart, Activity } from "lucide-react";
import { PersalinanFormData } from "./_FormPersalinanStep1";
import { PenapisanItem } from "./_FormPersalinanStep2";
import { PersalinanClinicalData } from "./_FormPersalinanStep3";

export interface MLPredictionResult {
  primary_diagnosis: string;
  confidence_score: number;
  risk_category: "KRR" | "KRT" | "KRST";
  risk_label: string;
  map: number;
  pulse_pressure: number;
  leu_trombo_ratio: number;
  probabilities?: Record<string, number>;
}

interface HasilPersalinanRingkasProps {
  formData: PersalinanFormData;
  clinicalData: PersalinanClinicalData;
  isGawatDarurat: boolean;
  positiveFactors: PenapisanItem[];
  mlResult: MLPredictionResult;
  onViewDetail: () => void;
  onRescreen: () => void;
}

export function HasilPersalinanRingkas({
  formData,
  clinicalData,
  isGawatDarurat,
  positiveFactors,
  mlResult,
  onViewDetail,
  onRescreen,
}: HasilPersalinanRingkasProps) {
  const isHighRisk = isGawatDarurat || mlResult.risk_category === "KRST";
  const calculatedImt = React.useMemo(() => {
    if (formData.imt) return formData.imt;
    const tb = formData.tinggi_badan || 155;
    const bb = formData.berat_badan || 60;
    if (tb > 0) {
      const tbMeter = tb / 100;
      return Number((bb / (tbMeter * tbMeter)).toFixed(1));
    }
    return 24.0;
  }, [formData.imt, formData.tinggi_badan, formData.berat_badan]);

  const efwGram = clinicalData?.efw_bayi_gram || 3000;

  const effectiveRiskCategory: "KRR" | "KRT" | "KRST" =
    isGawatDarurat || mlResult.risk_category === "KRST"
      ? "KRST"
      : mlResult.risk_category === "KRT"
      ? "KRT"
      : "KRR";

  const riskTitle =
    effectiveRiskCategory === "KRST"
      ? "Risiko Sangat Tinggi"
      : effectiveRiskCategory === "KRT"
      ? "Risiko Tinggi"
      : "Risiko Rendah";

  const riskTitleColor =
    effectiveRiskCategory === "KRST"
      ? "text-rose-600"
      : effectiveRiskCategory === "KRT"
      ? "text-amber-600"
      : "text-emerald-700";

  const pointerBadgeText =
    effectiveRiskCategory === "KRST"
      ? "Wajib Rujuk"
      : effectiveRiskCategory === "KRT"
      ? "Risiko Tinggi"
      : "Risiko Rendah";

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Card 1: Hasil Penapisan & Status */}
      <Card className="border border-slate-200/90 shadow-soft-xs bg-white rounded-3xl p-5 sm:p-6 space-y-3 text-center">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Hasil Penapisan Pasien:{" "}
            <span className="font-semibold text-slate-800">
              {formData.nama_pasien || "Ibu Hamil"} ({formData.umur} thn)
            </span>
          </p>
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-1.5 tracking-tight ${riskTitleColor}`}
          >
            {riskTitle}
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
            style={{
              left:
                effectiveRiskCategory === "KRST"
                  ? "85%"
                  : effectiveRiskCategory === "KRT"
                  ? "50%"
                  : "15%",
            }}
          >
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
            <div className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
              {pointerBadgeText}
            </div>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-600">
          Total Indikator Bahaya:{" "}
          <strong
            className={
              isGawatDarurat ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"
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
            Lihat Rincian &amp; Analisis ML &rarr;
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

      {/* Card 2: Hasil Prediksi Machine Learning */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-soft-xs space-y-2.5">
        <div className="text-xs font-bold text-slate-800">
          <span>Prediksi Komplikasi Machine Learning (ML)</span>
        </div>

        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80">
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Prediksi Komplikasi Utama</p>
            <p className="text-sm font-bold text-slate-900">{mlResult.primary_diagnosis}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-500 font-medium">Tingkat Keyakinan</p>
            <p className="text-sm font-bold text-emerald-700">
              {Math.round(mlResult.confidence_score * 100)}%
            </p>
          </div>
        </div>

        {/* Variabel Terhitung Otomatis (4 Fitur Klinis) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/70 text-center">
            <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">MAP</p>
            <p className="text-xs font-bold text-slate-800">{mlResult.map} <span className="text-[10px] font-normal text-slate-400">mmHg</span></p>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/70 text-center">
            <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Tekanan Nadi</p>
            <p className="text-xs font-bold text-slate-800">{mlResult.pulse_pressure} <span className="text-[10px] font-normal text-slate-400">mmHg</span></p>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/70 text-center">
            <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">IMT</p>
            <p className="text-xs font-bold text-slate-800">{calculatedImt} <span className="text-[10px] font-normal text-slate-400">kg/m²</span></p>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/70 text-center">
            <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">TBJ Janin</p>
            <p className="text-xs font-bold text-slate-800">{efwGram} <span className="text-[10px] font-normal text-slate-400">gram</span></p>
          </div>
        </div>
      </div>

      {/* Card 3: Rekomendasi Tempat & Penolong */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-xs space-y-1">
        <h4 className="font-bold text-rose-700 text-xs sm:text-sm">
          Rekomendasi Tempat &amp; Penolong Persalinan
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
          {isHighRisk
            ? "Wajib segera dirujuk dan bersalin di Rumah Sakit dengan fasilitas PONEK 24 Jam bersama Dokter Spesialis Kebidanan & Kandungan (Sp.OG)."
            : "Dianjurkan bersalin di Praktek Mandiri Bidan (PMB) atau Puskesmas PONED bersama Bidan dan Dokter Umum."}
        </p>
      </div>

      {/* Card 4: Saran Terapi Komplementer */}
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
