import React from "react";
import { Stethoscope, Activity, Calculator, UserCheck } from "lucide-react";
import { PersalinanFormData } from "./_FormPersalinanStep1";
import { PersalinanClinicalData } from "./_FormPersalinanStep3";
import { MLPredictionResult } from "./_HasilPersalinanRingkas";

interface HasilPersalinanKlinisCardProps {
  formData: PersalinanFormData;
  clinicalData: PersalinanClinicalData;
  mlResult: MLPredictionResult;
}

export function HasilPersalinanKlinisCard({
  formData,
  clinicalData,
  mlResult,
}: HasilPersalinanKlinisCardProps) {
  // Interpretasi Klinis MAP
  const mapStatus =
    mlResult.map >= 105
      ? "Hipertensi Derajat 2"
      : mlResult.map >= 95
      ? "Waspada Hipertensi Gestasional"
      : "Normal (< 95 mmHg)";

  // Interpretasi Pulse Pressure
  const ppStatus =
    mlResult.pulse_pressure > 50
      ? "Melebar (> 50 mmHg)"
      : mlResult.pulse_pressure < 30
      ? "Sempit (< 30 mmHg)"
      : "Normal (30 - 50 mmHg)";

  return (
    <div className="space-y-3.5">
      {/* CARD 1: Variabel Terhitung Otomatis Machine Learning */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-soft-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Calculator className="h-4 w-4 text-emerald-700" />
          <span>Variabel Klinis Hasil Kalkulasi Otomatis (Derived Features)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* MAP */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-1">
            <p className="text-[11px] font-medium text-slate-500">MAP (Mean Arterial Pressure)</p>
            <p className="text-base font-bold text-slate-900">{mlResult.map} <span className="text-xs font-normal text-slate-500">mmHg</span></p>
            <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              {mapStatus}
            </p>
          </div>

          {/* Pulse Pressure */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-1">
            <p className="text-[11px] font-medium text-slate-500">Pulse Pressure (Tekanan Nadi)</p>
            <p className="text-base font-bold text-slate-900">{mlResult.pulse_pressure} <span className="text-xs font-normal text-slate-500">mmHg</span></p>
            <p className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
              {ppStatus}
            </p>
          </div>

          {/* Rasio Leukosit / Trombosit */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-1">
            <p className="text-[11px] font-medium text-slate-500">Rasio Leu / Trombo (LTR)</p>
            <p className="text-base font-bold text-slate-900">{mlResult.leu_trombo_ratio.toFixed(4)}</p>
            <p className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
              Leukosit ÷ Trombosit
            </p>
          </div>
        </div>
      </div>

      {/* CARD 2: Rincian Seluruh Isian Parameter Form Persalinan */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Stethoscope className="h-4 w-4 text-emerald-700" />
          <span>Isian Parameter Form Persalinan &amp; Fitur Maternal ML</span>
        </div>

        {/* Tabel Ringkas 2 Kolom Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Kolom 1: Profil Maternal & Obstetri */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wide text-rose-600">
              Profil Maternal &amp; Obstetri
            </p>
            <div className="space-y-1 divide-y divide-slate-100">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Usia Bunda:</span>
                <span className="font-semibold text-slate-800">{formData.umur} Tahun</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Pekerjaan:</span>
                <span className="font-semibold text-slate-800">{formData.pekerjaan || "-"}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Pendidikan:</span>
                <span className="font-semibold text-slate-800">{formData.pendidikan || "-"}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Status Obstetri (GPA):</span>
                <span className="font-semibold text-slate-800">
                  G{formData.gravida} P{formData.paritas} A{formData.abortus}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Umur Kehamilan:</span>
                <span className="font-semibold text-slate-800">{clinicalData.umur_kehamilan}</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Klinis, Tanda Vital & Lab */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wide text-emerald-700">
              Klinis, Tanda Vital &amp; Laboratorium
            </p>
            <div className="space-y-1 divide-y divide-slate-100">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Tekanan Darah:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.sistolik} / {clinicalData.diastolik} mmHg
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Indeks Massa Tubuh (IMT):</span>
                <span className="font-semibold text-slate-800">{clinicalData.imt} kg/m²</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Hemoglobin (Hb):</span>
                <span className="font-semibold text-slate-800">{clinicalData.hb} g/dL</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Jumlah Leukosit:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.leokosit.toLocaleString()} /µL
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Jumlah Trombosit:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.trombosit.toLocaleString()} /µL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
