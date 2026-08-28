import React from "react";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { AlertTriangle, Info } from "lucide-react";
import { ScreeningInput } from "@/types/screening";

interface FormStep3GawatProps {
  formData: ScreeningInput;
  setFormData: React.Dispatch<React.SetStateAction<ScreeningInput>>;
}

export function FormStep3Gawat({ formData, setFormData }: FormStep3GawatProps) {
  const booleanFields: { field: keyof ScreeningInput; label: string }[] = [
    { field: "letak_sungsang", label: "Apakah bidan / dokter menyebutkan posisi bayi sungsang (kepala di atas, pantat di bawah)?" },
    { field: "letak_lintang", label: "Apakah posisi bayi melintang (tidak kepala di bawah, tidak sungsang)?" },
    { field: "pendarahan_kehamilan", label: "Apakah Bunda mengalami pendarahan dari jalan lahir selama kehamilan ini?" },
    { field: "preeklampsia_berat", label: "Apakah Bunda pernah didiagnosis preeklampsia berat atau mengalami kejang-kejang (eklampsia) saat hamil?" },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-600" />
          <span>Kondisi Gawat / Darurat</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5 ml-6">Kelompok III — Gawat Darurat Obstetrik (GDOB)</p>
      </div>
      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-2.5 text-xs text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">Kondisi berikut membutuhkan penanganan segera. Jawab sejujurnya agar hasil screening akurat.</p>
      </div>
      <div className="space-y-3.5">
        {booleanFields.map(({ field, label }) => (
          <div key={String(field)} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <Label className="text-xs font-bold text-slate-800 block">{label}</Label>
            <RadioGroup
              value={formData[field] ? "true" : "false"}
              onValueChange={(val) => setFormData({ ...formData, [field]: val === "true" })}
              className="flex gap-5 pt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${String(field)}-no`} />
                <Label htmlFor={`${String(field)}-no`} className="text-xs cursor-pointer">Tidak</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${String(field)}-yes`} />
                <Label htmlFor={`${String(field)}-yes`} className="text-xs cursor-pointer">Ya</Label>
              </div>
            </RadioGroup>
          </div>
        ))}
        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
          <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">Pemeriksaan tensi darah, detak jantung janin, dan tes laboratorium lengkap akan diverifikasi oleh Bidan saat Bunda berkunjung ke klinik / Puskesmas.</p>
        </div>
      </div>
    </div>
  );
}
