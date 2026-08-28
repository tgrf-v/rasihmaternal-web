import React from "react";
import { Stethoscope, Activity, Calculator, Clock, Baby } from "lucide-react";
import { PersalinanFormData } from "./_FormPersalinanStep1";
import { PersalinanClinicalData } from "./_FormPersalinanStep3";
import { MLPredictionResult } from "./_HasilPersalinanRingkas";
import { calculateGestationalAge } from "@/lib/scoringEngine";

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
  const gestationalInfo = React.useMemo(
    () => calculateGestationalAge(formData.hpht),
    [formData.hpht]
  );

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

          {/* IMT */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-1">
            <p className="text-[11px] font-medium text-slate-500">Indeks Massa Tubuh (IMT)</p>
            <p className="text-base font-bold text-slate-900">{calculatedImt} <span className="text-xs font-normal text-slate-500">kg/m²</span></p>
            <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              {calculatedImt >= 30 ? "Obesitas" : calculatedImt >= 25 ? "Overweight" : calculatedImt < 18.5 ? "Underweight" : "Normal"}
            </p>
          </div>
        </div>
      </div>

      {/* CARD 2: Rincian Seluruh Isian Parameter Form Persalinan */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Stethoscope className="h-4 w-4 text-emerald-700" />
          <span>Isian Parameter Form Persalinan &amp; Fitur Maternal ML v2</span>
        </div>

        {/* Tabel Ringkas 2 Kolom Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* Kolom 1: Profil Maternal & Obstetri */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
            <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wide text-rose-600 flex items-center gap-1">
              <Baby className="h-3.5 w-3.5" />
              <span>Profil Maternal &amp; Gestasi</span>
            </p>
            <div className="space-y-1 divide-y divide-slate-100">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Usia Bunda:</span>
                <span className="font-semibold text-slate-800">{formData.umur} Tahun</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Status Obstetri:</span>
                <span className="font-semibold text-slate-800">
                  G{formData.gravida} P{formData.paritas} A{formData.abortus}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Estimasi Gestasi:</span>
                <span className="font-semibold text-slate-800">
                  {gestationalInfo.formattedAge || "Aterm (38 Mgg)"}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Letak &amp; Jumlah Janin:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.presentasi_janin} ({clinicalData.jumlah_janin === 2 ? "Gemeli" : "Tunggal"})
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">TFU &amp; TBJ (Johnson):</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.tfu_cm || 32} cm · {clinicalData.efw_bayi_gram} g
                </span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Klinis, Tanda Vital & Partograf */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
            <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wide text-emerald-700 flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              <span>Tanda Vital &amp; Partograf</span>
            </p>
            <div className="space-y-1 divide-y divide-slate-100">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Tekanan Darah:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.sistolik} / {clinicalData.diastolik} mmHg
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Nadi &amp; Suhu:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.nadi} x/mnt · {clinicalData.suhu} °C
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Hemoglobin &amp; Protein Urin:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.hb} g/dL · {clinicalData.proteinuria}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Status Ketuban:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.status_ketuban} {clinicalData.status_ketuban === "Pecah" ? `(${clinicalData.lama_ketuban_pecah_jam} Jam)` : ""}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Pembukaan &amp; Station:</span>
                <span className="font-semibold text-slate-800">
                  {clinicalData.pembukaan_cm} cm · Station {clinicalData.station_kepala >= 0 ? `+${clinicalData.station_kepala}` : clinicalData.station_kepala}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
