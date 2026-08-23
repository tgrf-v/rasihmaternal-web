import React from "react";
import { router } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  ChevronLeft,
  AlertTriangle,
  ShieldCheck,
  Info,
  RefreshCw,
} from "lucide-react";
import { PersalinanFormData } from "./_FormPersalinanStep1";
import { PenapisanItem, PENAPISAN_PERSALINAN_LIST } from "./_FormPersalinanStep2";

interface HasilPersalinanDetailProps {
  formData: PersalinanFormData;
  isGawatDarurat: boolean;
  positiveFactors: PenapisanItem[];
  penapisanAnswers: Record<string, boolean>;
  onBackToSummary: () => void;
  onRescreen: () => void;
}

export function HasilPersalinanDetail({
  formData,
  isGawatDarurat,
  positiveFactors,
  penapisanAnswers,
  onBackToSummary,
  onRescreen,
}: HasilPersalinanDetailProps) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <button
        type="button"
        onClick={onBackToSummary}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors mb-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Kembali ke Hasil Ringkas</span>
      </button>

      <Card className="border border-slate-200/90 shadow-soft-xs bg-white rounded-3xl p-5 sm:p-6 space-y-4 text-center">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Status Penapisan:{" "}
            <span className="font-semibold text-slate-700">
              {formData.nama_pasien} ({formData.umur} thn)
            </span>
          </p>
          <h2
            className={`text-xl sm:text-2xl font-bold tracking-tight mt-1 ${
              isGawatDarurat ? "text-rose-600" : "text-emerald-700"
            }`}
          >
            {isGawatDarurat
              ? "Terdeteksi Komplikasi Gawat Darurat"
              : "Persalinan Fisiologis (Normal & Aman)"}
          </h2>
        </div>

        {/* Status Alert Badge */}
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold ${
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
              ? `${positiveFactors.length} Indikator Kegawatdaruratan Terdeteksi (Wajib Rujuk)`
              : "Seluruh 19 Indikator Normal (Tidak Ada Gawat Darurat)"}
          </span>
        </div>
      </Card>

      {/* Cyan Banner Info */}
      <div className="p-3.5 px-5 rounded-full bg-cyan-50 border border-cyan-100/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-900">
          <Info className="h-4 w-4 text-cyan-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            Gunakan hasil penapisan ini untuk rujukan persalinan terencana.
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="font-bold text-cyan-700 hover:text-cyan-900 hover:underline shrink-0 text-xs"
        >
          Cetak
        </button>
      </div>

      {/* Rincian Seluruh 19 Indikator */}
      <div className="space-y-2.5 pt-1">
        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
          Rincian 19 Parameter Penapisan:
        </h4>
        <div className="space-y-2">
          {PENAPISAN_PERSALINAN_LIST.map((item) => {
            const isPositive = penapisanAnswers[item.id] === true;
            return (
              <div
                key={item.id}
                className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
                  isPositive
                    ? "bg-rose-50/50 border-rose-200/90 text-rose-900"
                    : "bg-white border-slate-200/80 text-slate-700 shadow-soft-xs"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPositive
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.no}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                    isPositive
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isPositive ? "YA (Bahaya)" : "TIDAK"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-3 flex items-center gap-3">
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
          <span>Buka Kamus Terapi</span>
        </Button>
      </div>
    </div>
  );
}
