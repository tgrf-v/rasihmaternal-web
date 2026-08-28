import React from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { NumberStepper } from "@/Components/ui/number-stepper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Activity, Stethoscope, Clock, HeartPulse, ShieldAlert, Calculator } from "lucide-react";
import { calculateJohnsonTBJ } from "@/lib/scoringEngine";

export interface PersalinanClinicalData {
  // Tanda Vital & Laboratorium
  sistolik: number;
  diastolik: number;
  nadi: number;
  suhu: number;
  hb: number;
  proteinuria: "Negatif" | "Trace" | "1+" | "2+" | "3+" | "4+";

  // Kondisi Janin & TBJ
  presentasi_janin: "Kepala" | "Bokong/Sungsang" | "Lintang" | "Oblique";
  jumlah_janin: number;
  tfu_cm?: number;
  efw_bayi_gram: number;
  djj: number;

  // Kemajuan Persalinan & Partograf
  status_ketuban: "Utuh" | "Pecah";
  lama_ketuban_pecah_jam: number;
  pembukaan_cm: number;
  station_kepala: number;
  kontraksi_10menit: number;
  durasi_kontraksi_detik: number;
  jenis_persalinan?: string;
}

interface FormPersalinanStep3Props {
  clinicalData: PersalinanClinicalData;
  setClinicalData: React.Dispatch<React.SetStateAction<PersalinanClinicalData>>;
  errors: Record<string, string>;
}

export function FormPersalinanStep3({
  clinicalData,
  setClinicalData,
  errors,
}: FormPersalinanStep3Props) {
  const handleChange = <K extends keyof PersalinanClinicalData>(
    field: K,
    value: PersalinanClinicalData[K]
  ) => {
    setClinicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const tbjCalc = React.useMemo(() => {
    const tfu = clinicalData.tfu_cm || 32;
    const station = clinicalData.station_kepala ?? -1;
    return calculateJohnsonTBJ(tfu, station);
  }, [clinicalData.tfu_cm, clinicalData.station_kepala]);

  React.useEffect(() => {
    if (tbjCalc.tbjGram && clinicalData.efw_bayi_gram !== tbjCalc.tbjGram) {
      handleChange("efw_bayi_gram", tbjCalc.tbjGram);
    }
  }, [tbjCalc.tbjGram]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Seksi: Tanda-Tanda Vital & Laboratorium */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Activity className="h-4 w-4 text-rose-600" />
          <span>Tanda-Tanda Vital &amp; Laboratorium Medis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sistolik */}
          <div className="space-y-1">
            <Label htmlFor="sistolik" className="text-xs font-semibold text-slate-700">
              Tekanan Darah Sistol (mmHg) <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="sistolik"
              type="number"
              min="60"
              max="260"
              value={clinicalData.sistolik || ""}
              onChange={(e) => handleChange("sistolik", parseInt(e.target.value, 10) || 0)}
              placeholder="120"
              className="rounded-full bg-white text-xs h-9"
            />
            {errors.sistolik && (
              <p className="text-[11px] text-rose-600">{errors.sistolik}</p>
            )}
          </div>

          {/* Diastolik */}
          <div className="space-y-1">
            <Label htmlFor="diastolik" className="text-xs font-semibold text-slate-700">
              Tekanan Darah Diastol (mmHg) <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="diastolik"
              type="number"
              min="40"
              max="160"
              value={clinicalData.diastolik || ""}
              onChange={(e) => handleChange("diastolik", parseInt(e.target.value, 10) || 0)}
              placeholder="80"
              className="rounded-full bg-white text-xs h-9"
            />
            {errors.diastolik && (
              <p className="text-[11px] text-rose-600">{errors.diastolik}</p>
            )}
          </div>

          {/* Nadi */}
          <div className="space-y-1">
            <Label htmlFor="nadi" className="text-xs font-semibold text-slate-700">
              Denyut Nadi Ibu (x/menit)
            </Label>
            <Input
              id="nadi"
              type="number"
              min="40"
              max="200"
              value={clinicalData.nadi || ""}
              onChange={(e) => handleChange("nadi", parseInt(e.target.value, 10) || 80)}
              placeholder="80"
              className="rounded-full bg-white text-xs h-9"
            />
          </div>

          {/* Suhu Tubuh */}
          <div className="space-y-1">
            <Label htmlFor="suhu" className="text-xs font-semibold text-slate-700">
              Suhu Tubuh (°C)
            </Label>
            <Input
              id="suhu"
              type="number"
              step="0.1"
              min="30"
              max="45"
              value={clinicalData.suhu || ""}
              onChange={(e) => handleChange("suhu", parseFloat(e.target.value) || 36.5)}
              placeholder="36.5"
              className="rounded-full bg-white text-xs h-9"
            />
          </div>

          {/* Kadar Hemoglobin (Hb) */}
          <div className="space-y-1">
            <Label htmlFor="hb" className="text-xs font-semibold text-slate-700">
              Kadar Hemoglobin / Hb (g/dL)
            </Label>
            <Input
              id="hb"
              type="number"
              step="0.1"
              min="3"
              max="20"
              value={clinicalData.hb || ""}
              onChange={(e) => handleChange("hb", parseFloat(e.target.value) || 12.0)}
              placeholder="12.0"
              className="rounded-full bg-white text-xs h-9"
            />
          </div>

          {/* Protein Urin */}
          <div className="space-y-1">
            <Label htmlFor="proteinuria" className="text-xs font-semibold text-slate-700">
              Protein Urin (Proteinuria)
            </Label>
            <Select
              value={clinicalData.proteinuria || "Negatif"}
              onValueChange={(val) => handleChange("proteinuria", val as PersalinanClinicalData["proteinuria"])}
            >
              <SelectTrigger id="proteinuria" className="rounded-full bg-white text-xs h-9">
                <SelectValue placeholder="Pilih hasil protein urin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Negatif">Negatif (-)</SelectItem>
                <SelectItem value="Trace">Trace (Samar)</SelectItem>
                <SelectItem value="1+">1+ (Positif 1)</SelectItem>
                <SelectItem value="2+">2+ (Positif 2)</SelectItem>
                <SelectItem value="3+">3+ (Positif 3)</SelectItem>
                <SelectItem value="4+">4+ (Positif 4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Seksi: Kondisi & Kesejahteraan Janin */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Stethoscope className="h-4 w-4 text-emerald-700" />
          <span>Kondisi &amp; Posisi Janin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Letak Janin */}
          <div className="space-y-1">
            <Label htmlFor="presentasi_janin" className="text-xs font-semibold text-slate-700">
              Letak Janin
            </Label>
            <Select
              value={clinicalData.presentasi_janin || "Kepala"}
              onValueChange={(val) => handleChange("presentasi_janin", val as PersalinanClinicalData["presentasi_janin"])}
            >
              <SelectTrigger id="presentasi_janin" className="rounded-full bg-white text-xs h-9">
                <SelectValue placeholder="Pilih letak janin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kepala">Kepala (Normal)</SelectItem>
                <SelectItem value="Bokong/Sungsang">Bokong / Sungsang</SelectItem>
                <SelectItem value="Lintang">Lintang</SelectItem>
                <SelectItem value="Oblique">Oblique (Serong)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Jumlah Janin */}
          <div className="space-y-1">
            <Label htmlFor="jumlah_janin" className="text-xs font-semibold text-slate-700">
              Jumlah Janin
            </Label>
            <Select
              value={String(clinicalData.jumlah_janin || 1)}
              onValueChange={(val) => handleChange("jumlah_janin", parseInt(val, 10) || 1)}
            >
              <SelectTrigger id="jumlah_janin" className="rounded-full bg-white text-xs h-9">
                <SelectValue placeholder="Pilih jumlah janin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Tunggal (1 Janin)</SelectItem>
                <SelectItem value="2">Kembar / Gemeli (2+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Denyut Jantung Janin (DJJ) */}
          <div className="space-y-1">
            <Label htmlFor="djj" className="text-xs font-semibold text-slate-700">
              Denyut Jantung Janin / DJJ (dpm)
            </Label>
            <Input
              id="djj"
              type="number"
              min="60"
              max="220"
              value={clinicalData.djj || ""}
              onChange={(e) => handleChange("djj", parseFloat(e.target.value) || 140)}
              placeholder="140"
              className="rounded-full bg-white text-xs h-9"
            />
          </div>

          {/* Tinggi Fundus Uteri (TFU) */}
          <div className="space-y-1">
            <Label htmlFor="tfu_cm" className="text-xs font-semibold text-slate-700">
              Tinggi Fundus Uteri / TFU (cm)
            </Label>
            <Input
              id="tfu_cm"
              type="number"
              min="15"
              max="50"
              value={clinicalData.tfu_cm || 32}
              onChange={(e) => handleChange("tfu_cm", parseFloat(e.target.value) || 0)}
              placeholder="32"
              className="rounded-full bg-white text-xs h-9"
            />
            <p className="text-[10px] text-slate-500 font-medium">
              TBJ: ({clinicalData.tfu_cm || 32} - {tbjCalc.nConstant}) × 155 = {tbjCalc.tbjGram.toLocaleString("id-ID")} gram
            </p>
          </div>
        </div>
      </div>

      {/* Seksi: Kemajuan Persalinan & Partograf */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Clock className="h-4 w-4 text-emerald-700" />
          <span>Parameter Kemajuan Persalinan (Partograf)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Status Ketuban */}
          <div className="space-y-1">
            <Label htmlFor="status_ketuban" className="text-xs font-semibold text-slate-700">
              Status Selaput Ketuban
            </Label>
            <Select
              value={clinicalData.status_ketuban || "Utuh"}
              onValueChange={(val) => handleChange("status_ketuban", val as "Utuh" | "Pecah")}
            >
              <SelectTrigger id="status_ketuban" className="rounded-full bg-white text-xs h-9">
                <SelectValue placeholder="Pilih status ketuban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Utuh">Utuh</SelectItem>
                <SelectItem value="Pecah">Pecah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lama Ketuban Pecah */}
          <div className="space-y-1">
            <Label htmlFor="lama_ketuban_pecah_jam" className="text-xs font-semibold text-slate-700">
              Lama Ketuban Pecah (Jam)
            </Label>
            <Input
              id="lama_ketuban_pecah_jam"
              type="number"
              min="0"
              max="120"
              disabled={clinicalData.status_ketuban === "Utuh"}
              value={clinicalData.status_ketuban === "Utuh" ? 0 : (clinicalData.lama_ketuban_pecah_jam || "")}
              onChange={(e) => handleChange("lama_ketuban_pecah_jam", parseFloat(e.target.value) || 0)}
              placeholder="0 jika masih utuh"
              className="rounded-full bg-white text-xs h-9 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          {/* Pembukaan Serviks */}
          <div className="space-y-1">
            <Label htmlFor="pembukaan_cm" className="text-xs font-semibold text-slate-700">
              Pembukaan Serviks (cm)
            </Label>
            <Input
              id="pembukaan_cm"
              type="number"
              step="0.5"
              min="0"
              max="10"
              value={clinicalData.pembukaan_cm || ""}
              onChange={(e) => handleChange("pembukaan_cm", parseFloat(e.target.value) || 4.0)}
              placeholder="4.0"
              className="rounded-full bg-white text-xs h-9"
            />
          </div>

          {/* Penurunan Kepala */}
          <div className="space-y-1">
            <Label htmlFor="station_kepala" className="text-xs font-semibold text-slate-700">
              Penurunan Kepala (-3 s.d +3)
            </Label>
            <Select
              value={String(clinicalData.station_kepala ?? -1)}
              onValueChange={(val) => handleChange("station_kepala", parseFloat(val))}
            >
              <SelectTrigger id="station_kepala" className="rounded-full bg-white text-xs h-9">
                <SelectValue placeholder="Pilih station kepala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-3">-3 (Hodge I)</SelectItem>
                <SelectItem value="-2">-2 (Hodge I-II)</SelectItem>
                <SelectItem value="-1">-1 (Hodge II)</SelectItem>
                <SelectItem value="0">0 (Hodge III / Spina 0)</SelectItem>
                <SelectItem value="1">+1 (Hodge III+)</SelectItem>
                <SelectItem value="2">+2 (Hodge IV / Panggul)</SelectItem>
                <SelectItem value="3">+3 (Hodge IV / Vulva)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Frekuensi Kontraksi */}
          <div className="space-y-1">
            <Label htmlFor="kontraksi_10menit" className="text-xs font-semibold text-slate-700">
              Frekuensi Kontraksi (x / 10 menit)
            </Label>
            <Input
              id="kontraksi_10menit"
              type="number"
              min="0"
              max="10"
              value={clinicalData.kontraksi_10menit || ""}
              onChange={(e) => handleChange("kontraksi_10menit", parseFloat(e.target.value) || 3.0)}
              placeholder="3"
              className="rounded-full bg-white text-xs h-9"
            />
          </div>

          {/* Durasi Kontraksi */}
          <div className="space-y-1">
            <Label htmlFor="durasi_kontraksi_detik" className="text-xs font-semibold text-slate-700">
              Durasi Kontraksi (Detik)
            </Label>
            <Input
              id="durasi_kontraksi_detik"
              type="number"
              min="0"
              max="120"
              value={clinicalData.durasi_kontraksi_detik || ""}
              onChange={(e) => handleChange("durasi_kontraksi_detik", parseFloat(e.target.value) || 35.0)}
              placeholder="35"
              className="rounded-full bg-white text-xs h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
