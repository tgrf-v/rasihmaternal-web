import React from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Activity, Stethoscope, FlaskConical } from "lucide-react";

export interface PersalinanClinicalData {
  umur_kehamilan: string; // "Preterm" | "Aterm" | "Postterm"
  letak_janin: string; // "Memanjang" | "Melintang" | "Obliq" | "Gemeli"
  jenis_persalinan: string; // "Persalinan Pervaginam" | "Sectio Sesarea"
  imt: number;
  sistolik: number;
  diastolik: number;
  hb: number;
  leokosit: number;
  trombosit: number;
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

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Seksi 1: Kondisi Kehamilan & Janin */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Stethoscope className="h-4 w-4 text-emerald-700" />
          <span>Kondisi Kehamilan &amp; Posisi Janin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Umur Kehamilan */}
          <div className="space-y-1">
            <Label htmlFor="umur_kehamilan" className="text-xs font-semibold text-slate-700">
              Umur Kehamilan
            </Label>
            <Select
              value={clinicalData.umur_kehamilan}
              onValueChange={(val) => handleChange("umur_kehamilan", val)}
            >
              <SelectTrigger id="umur_kehamilan" className="rounded-full bg-white text-xs h-9">
                <SelectValue placeholder="Pilih umur kehamilan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preterm">Preterm (&lt; 37 minggu)</SelectItem>
                <SelectItem value="Aterm">Aterm (37 - 41 minggu)</SelectItem>
                <SelectItem value="Postterm">Postterm (&ge; 42 minggu)</SelectItem>
              </SelectContent>
            </Select>
            {errors.umur_kehamilan && (
              <p className="text-[11px] text-rose-500">{errors.umur_kehamilan}</p>
            )}
          </div>

          {/* Letak Janin */}
          <div className="space-y-1">
            <Label htmlFor="letak_janin" className="text-xs font-semibold text-slate-700">
              Letak / Posisi Janin
            </Label>
            <Select
              value={clinicalData.letak_janin}
              onValueChange={(val) => handleChange("letak_janin", val)}
            >
              <SelectTrigger id="letak_janin" className="rounded-full bg-white text-xs h-9">
                <SelectValue placeholder="Pilih letak janin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Memanjang">Memanjang (Kepala Bawah / Sungsang)</SelectItem>
                <SelectItem value="Melintang">Melintang (Transverse)</SelectItem>
                <SelectItem value="Obliq">Obliq (Serong)</SelectItem>
                <SelectItem value="Gemeli">Gemeli (Kehamilan Kembar)</SelectItem>
              </SelectContent>
            </Select>
            {errors.letak_janin && (
              <p className="text-[11px] text-rose-500">{errors.letak_janin}</p>
            )}
          </div>

          {/* Rencana / Jenis Persalinan */}
          <div className="space-y-1">
            <Label htmlFor="jenis_persalinan" className="text-xs font-semibold text-slate-700">
              Rencana Jenis Persalinan
            </Label>
            <Select
              value={clinicalData.jenis_persalinan}
              onValueChange={(val) => handleChange("jenis_persalinan", val)}
            >
              <SelectTrigger id="jenis_persalinan" className="rounded-full bg-white text-xs h-9">
                <SelectValue placeholder="Pilih jenis persalinan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Persalinan Pervaginam">Persalinan Pervaginam (Normal)</SelectItem>
                <SelectItem value="Sectio Sesarea">Sectio Sesarea (Operasi SC)</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenis_persalinan && (
              <p className="text-[11px] text-rose-500">{errors.jenis_persalinan}</p>
            )}
          </div>

          {/* Indeks Massa Tubuh (IMT) */}
          <div className="space-y-1">
            <Label htmlFor="imt" className="text-xs font-semibold text-slate-700">
              Indeks Massa Tubuh (IMT / BMI)
            </Label>
            <Input
              id="imt"
              type="number"
              step="0.1"
              min="10"
              max="60"
              value={clinicalData.imt || ""}
              onChange={(e) => handleChange("imt", parseFloat(e.target.value) || 0)}
              placeholder="Contoh: 22.5"
              className="rounded-full bg-white text-xs h-9"
            />
            {errors.imt && <p className="text-[11px] text-rose-500">{errors.imt}</p>}
          </div>
        </div>
      </div>

      {/* Seksi 2: Tanda Vital & Laboratorium Medis */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Activity className="h-4 w-4 text-rose-600" />
          <span>Tekanan Darah &amp; Hasil Laboratorium Darah</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sistolik */}
          <div className="space-y-1">
            <Label htmlFor="sistolik" className="text-xs font-semibold text-slate-700">
              Tekanan Darah: Sistol (mmHg)
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
              <p className="text-[11px] text-rose-500">{errors.sistolik}</p>
            )}
          </div>

          {/* Diastolik */}
          <div className="space-y-1">
            <Label htmlFor="diastolik" className="text-xs font-semibold text-slate-700">
              Tekanan Darah: Diastol (mmHg)
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
              <p className="text-[11px] text-rose-500">{errors.diastolik}</p>
            )}
          </div>

          {/* Hemoglobin */}
          <div className="space-y-1">
            <Label htmlFor="hb" className="text-xs font-semibold text-slate-700">
              Hemoglobin (g/dL)
            </Label>
            <Input
              id="hb"
              type="number"
              step="0.1"
              min="3"
              max="25"
              value={clinicalData.hb || ""}
              onChange={(e) => handleChange("hb", parseFloat(e.target.value) || 0)}
              placeholder="Contoh: 12.0"
              className="rounded-full bg-white text-xs h-9"
            />
            {errors.hb && <p className="text-[11px] text-rose-500">{errors.hb}</p>}
          </div>

          {/* Leukosit */}
          <div className="space-y-1">
            <Label htmlFor="leokosit" className="text-xs font-semibold text-slate-700">
              Leukosit (/uL)
            </Label>
            <Input
              id="leokosit"
              type="number"
              min="500"
              max="80000"
              value={clinicalData.leokosit || ""}
              onChange={(e) => handleChange("leokosit", parseInt(e.target.value, 10) || 0)}
              placeholder="Contoh: 9000"
              className="rounded-full bg-white text-xs h-9"
            />
            {errors.leokosit && (
              <p className="text-[11px] text-rose-500">{errors.leokosit}</p>
            )}
          </div>

          {/* Trombosit */}
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="trombosit" className="text-xs font-semibold text-slate-700">
              Trombosit (/uL)
            </Label>
            <Input
              id="trombosit"
              type="number"
              min="10000"
              max="1000000"
              value={clinicalData.trombosit || ""}
              onChange={(e) => handleChange("trombosit", parseInt(e.target.value, 10) || 0)}
              placeholder="Contoh: 250000"
              className="rounded-full bg-white text-xs h-9"
            />
            {errors.trombosit && (
              <p className="text-[11px] text-rose-500">{errors.trombosit}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
