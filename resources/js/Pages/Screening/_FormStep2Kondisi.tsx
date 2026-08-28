import React from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Baby } from "lucide-react";
import { ScreeningInput } from "@/types/screening";

interface FormStep2KondisiProps {
  formData: ScreeningInput;
  setFormData: React.Dispatch<React.SetStateAction<ScreeningInput>>;
  toggleCheckbox: (field: keyof ScreeningInput, value: string) => void;
}

export function FormStep2Kondisi({ formData, setFormData, toggleCheckbox }: FormStep2KondisiProps) {
  const booleanFields: { field: keyof ScreeningInput; label: string }[] = [
    { field: "bengkak_darah_tinggi", label: "Apakah Bunda mengalami bengkak pada wajah atau tungkai disertai tekanan darah tinggi?" },
    { field: "hamil_kembar", label: "Apakah Bunda sedang hamil kembar (lebih dari 1 bayi)?" },
    { field: "hydramnion", label: "Apakah dokter / bidan menyebutkan cairan ketuban Bunda terlalu banyak (Hydramnion)?" },
    { field: "riwayat_bayi_mati", label: "Apakah pada kehamilan sebelumnya ada bayi yang meninggal dalam kandungan?" },
    { field: "serotinus", label: "Apakah usia kehamilan Bunda sudah lebih dari 42 minggu (lewat bulan / serotinus)?" },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Baby className="h-4 w-4 text-rose-600" />
          <span>Kondisi Kehamilan Saat Ini</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5 ml-6">Kelompok II — Ada Gawat Obstetrik (AGO)</p>
      </div>
      <div className="space-y-3.5">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
          <Label className="text-xs font-bold text-slate-800 block">
            Apakah Bunda saat ini menderita salah satu penyakit berikut? (boleh pilih lebih dari satu)
          </Label>
          <p className="text-[11px] text-slate-500">Pilih semua yang berlaku. Jika tidak ada, lewati bagian ini.</p>
          <div className="grid grid-cols-1 gap-2 pt-1">
            {[
              { value: "anemia", label: "Kurang darah / Anemia (sering lemas, pucat, pusing)" },
              { value: "malaria", label: "Malaria" },
              { value: "tbc", label: "TBC Paru (batuk lama, keringat malam)" },
              { value: "jantung", label: "Payah jantung (sesak napas, berdebar)" },
              { value: "diabetes", label: "Kencing manis / Diabetes" },
              { value: "pms", label: "Penyakit menular seksual (misal: sifilis, gonore)" },
            ].map(({ value, label }) => (
              <Checkbox
                key={value}
                id={`penyakit-${value}`}
                checked={(formData.penyakit_saat_ini ?? []).includes(value)}
                onCheckedChange={() => toggleCheckbox("penyakit_saat_ini", value)}
                label={label}
              />
            ))}
          </div>
        </div>
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
      </div>
    </div>
  );
}
