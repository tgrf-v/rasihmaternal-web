import React from "react";
import { router } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  ChevronLeft,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { PersalinanFormData } from "./_FormPersalinanStep1";
import { PenapisanItem, PENAPISAN_PERSALINAN_LIST } from "./_FormPersalinanStep2";
import { PersalinanClinicalData } from "./_FormPersalinanStep3";
import { MLPredictionResult } from "./_HasilPersalinanRingkas";
import { HasilPersalinanKlinisCard } from "./_HasilPersalinanKlinisCard";

interface HasilPersalinanDetailProps {
  formData: PersalinanFormData;
  clinicalData: PersalinanClinicalData;
  isGawatDarurat: boolean;
  positiveFactors: PenapisanItem[];
  penapisanAnswers: Record<string, boolean>;
  mlResult: MLPredictionResult;
  onBackToSummary: () => void;
  onRescreen: () => void;
}

export function HasilPersalinanDetail({
  formData,
  clinicalData,
  isGawatDarurat,
  positiveFactors,
  penapisanAnswers,
  mlResult,
  onBackToSummary,
  onRescreen,
}: HasilPersalinanDetailProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <button
        type="button"
        onClick={onBackToSummary}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors mb-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Kembali ke Hasil Ringkas</span>
      </button>

      {/* Header Card */}
      <Card className="border border-slate-200/90 shadow-soft-xs bg-white rounded-3xl p-5 space-y-3 text-center">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Analisis Detail:{" "}
            <span className="font-semibold text-slate-700">
              {formData.nama_pasien} ({formData.umur} thn)
            </span>
          </p>
          <h2
            className={`text-xl sm:text-2xl font-bold tracking-tight mt-1 ${
              isGawatDarurat || mlResult.risk_category === "KRST"
                ? "text-rose-600"
                : mlResult.risk_category === "KRT"
                ? "text-amber-600"
                : "text-emerald-700"
            }`}
          >
            {isGawatDarurat || mlResult.risk_category === "KRST"
              ? "Risiko Sangat Tinggi"
              : mlResult.risk_category === "KRT"
              ? "Risiko Tinggi"
              : "Risiko Rendah"}
          </h2>
        </div>

        {/* Status Badge */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold ${
            isGawatDarurat
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {isGawatDarurat ? (
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          )}
          <span>
            {isGawatDarurat
              ? `${positiveFactors.length} Indikator Bahaya Terdeteksi (Wajib Rujuk)`
              : "Semua 19 Indikator Penapisan Normal"}
          </span>
        </div>
      </Card>

      {/* Card 1 & 2: Isian Parameter Form Persalinan & Variabel Terhitung Otomatis ML */}
      <HasilPersalinanKlinisCard
        formData={formData}
        clinicalData={clinicalData}
        mlResult={mlResult}
      />

      {/* Probabilitas Komplikasi Machine Learning */}
      <div className="space-y-2.5 p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-soft-xs">
        <div className="text-xs font-bold text-slate-900">
          <span>Probabilitas Prediksi Komplikasi (Machine Learning)</span>
        </div>

        <div className="space-y-2">
          {mlResult.probabilities &&
            Object.entries(mlResult.probabilities).map(([compName, probVal]) => {
              const pct = Math.round((probVal as number) * 100);
              const isTop = compName === mlResult.primary_diagnosis;
              return (
                <div key={compName} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={isTop ? "text-rose-600 font-bold" : "text-slate-700"}>
                      {compName} {isTop && "(Prediksi Utama)"}
                    </span>
                    <span className="text-slate-600 font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTop ? "bg-rose-600" : "bg-emerald-600"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Rincian 19 Parameter Penapisan */}
      <div className="space-y-2 pt-1">
        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
          Rincian 19 Parameter Penapisan Ibu Bersalin:
        </h4>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {PENAPISAN_PERSALINAN_LIST.map((item) => {
            const isPositive = penapisanAnswers[item.id] === true;
            return (
              <div
                key={item.id}
                className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
                  isPositive
                    ? "bg-rose-50/50 border-rose-200/90 text-rose-900"
                    : "bg-white border-slate-200/80 text-slate-700 shadow-soft-xs"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isPositive ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.no}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                    isPositive ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isPositive ? "YA" : "TIDAK"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2 flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onRescreen}
          className="flex-1 rounded-full text-xs font-bold py-2.5"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          <span>Penapisan Ulang</span>
        </Button>
        <Button
          type="button"
          onClick={() => router.visit("/kamus")}
          className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5"
        >
          <span>Kamus Terapi</span>
        </Button>
      </div>
    </div>
  );
}
