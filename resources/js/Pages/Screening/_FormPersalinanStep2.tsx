import React from "react";
import { Baby } from "lucide-react";

export interface PenapisanItem {
  id: string;
  no: number;
  label: string;
}

export const PENAPISAN_PERSALINAN_LIST: PenapisanItem[] = [
  { id: "riwayat_bedah_sesar", no: 1, label: "Riwayat bedah sesar" },
  { id: "perdarahan_pervaginam", no: 2, label: "Perdarahan pervaginam" },
  { id: "kehamilan_kurang_bulan", no: 3, label: "Kehamilan kurang bulan" },
  { id: "ketuban_pecah_mekonium", no: 4, label: "Ketuban pecah dengan mekonium kental" },
  { id: "ketuban_pecah_lama", no: 5, label: "Ketuban pecah lama (> 8 jam)" },
  { id: "ketuban_pecah_kurang_bulan", no: 6, label: "Ketuban pecah pada kehamilan kurang bulan" },
  { id: "ikterus", no: 7, label: "Ikterus" },
  { id: "anemi_berat", no: 8, label: "Anemi berat" },
  { id: "preeklamsi_berat", no: 9, label: "Preklamsi berat" },
  { id: "tfu_makrosomi", no: 10, label: "Tinggi fundus uteri > 40 cm (makrosomi)" },
  { id: "demam_tinggi", no: 11, label: "Demam (> 38 °C)" },
  { id: "gawat_janin", no: 12, label: "Gawat janin" },
  { id: "presentasi_bukan_kepala", no: 13, label: "Presentasi bukan belakang kepala" },
  { id: "tali_pusat_menumbung", no: 14, label: "Tali pusat menumbung" },
  { id: "gemeli", no: 15, label: "Gemeli (kehamilan kembar)" },
  { id: "tfu_rendah", no: 16, label: "Kehamilan dengan TFU < 28 cm" },
  { id: "presentasi_majemuk", no: 17, label: "Presentasi Majemuk" },
  { id: "palpasi_kepala_tinggi", no: 18, label: "Primi Para fase aktif palpasi kepala 5/5" },
  { id: "syok", no: 19, label: "Syok" },
];

interface FormPersalinanStep2Props {
  penapisanAnswers: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
}

export function FormPersalinanStep2({
  penapisanAnswers,
  onToggle,
}: FormPersalinanStep2Props) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Baby className="h-4 w-4 text-rose-600" />
          <span>Langkah 2: 19 Indikator Penapisan Gawat Darurat</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5 ml-6">
          Pilih YA jika kondisi terdeteksi pada ibu bersalin.
        </p>
      </div>

      <div className="space-y-2.5 pt-1">
        {PENAPISAN_PERSALINAN_LIST.map((item) => {
          const isPositive = penapisanAnswers[item.id] === true;
          return (
            <div
              key={item.id}
              className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                isPositive
                  ? "bg-rose-50/70 border-rose-300 shadow-soft-xs"
                  : "bg-white border-slate-200/80 shadow-soft-xs hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isPositive
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.no}
                </span>
                <span
                  className={`text-xs sm:text-sm leading-snug ${
                    isPositive
                      ? "font-bold text-rose-950"
                      : "font-semibold text-slate-800"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {/* Toggle Buttons YA / TIDAK */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggle(item.id, false)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    !isPositive
                      ? "bg-slate-800 text-white shadow-soft-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Tidak
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(item.id, true)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isPositive
                      ? "bg-rose-600 text-white shadow-soft-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  Ya
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
