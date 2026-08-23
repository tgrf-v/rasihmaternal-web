import React from "react";
import { Input } from "@/Components/ui/input";
import { NumberStepper } from "@/Components/ui/number-stepper";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { DatePicker } from "@/Components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { User, Calendar } from "lucide-react";
import { ScreeningInput } from "@/types/screening";

interface FormStep1IdentitasProps {
  formData: ScreeningInput;
  setFormData: React.Dispatch<React.SetStateAction<ScreeningInput>>;
  errors: Record<string, string>;
  gestationalInfo: { weeks: number; days: number; dueDate?: string; formattedAge: string };
  isHamilPertama: boolean;
  toggleCheckbox: (field: keyof ScreeningInput, value: string) => void;
}

export function FormStep1Identitas({
  formData,
  setFormData,
  errors,
  gestationalInfo,
  isHamilPertama,
  toggleCheckbox,
}: FormStep1IdentitasProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="h-4 w-4 text-emerald-700" />
          <span>Langkah 1: Identitas &amp; Riwayat Kehamilan</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5 ml-6">Kelompok I — Ada Potensi Gawat Obstetrik (APGO)</p>
      </div>
      <div className="space-y-3.5">
        <div>
          <Label htmlFor="nama_pasien">Nama Lengkap Bunda <span className="text-rose-600">*</span></Label>
          <Input
            id="nama_pasien"
            placeholder="Masukkan nama lengkap Bunda..."
            value={formData.nama_pasien}
            onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })}
            error={errors.nama_pasien}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="kehamilan_ke">Ini Kehamilan ke- <span className="text-rose-600">*</span></Label>
            <NumberStepper
              id="kehamilan_ke"
              min={1}
              max={20}
              value={formData.kehamilan_ke ?? 1}
              onChange={(val) => setFormData({ ...formData, kehamilan_ke: val })}
              error={errors.kehamilan_ke}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="umur">Usia Bunda (Tahun) <span className="text-rose-600">*</span></Label>
            <NumberStepper
              id="umur"
              min={12}
              max={60}
              value={formData.umur || ""}
              onChange={(val) => setFormData({ ...formData, umur: val })}
              error={errors.umur}
              suffix="thn"
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="hpht">Hari Pertama Haid Terakhir (HPHT) <span className="text-rose-600">*</span></Label>
          <DatePicker
            id="hpht"
            value={formData.hpht}
            onChange={(val) => setFormData({ ...formData, hpht: val })}
            placeholder="Pilih Tanggal HPHT Bunda"
            error={errors.hpht}
            className="mt-1"
          />
          {(gestationalInfo.weeks > 0 || gestationalInfo.days > 0) && (
            <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Estimasi Usia Kandungan: {gestationalInfo.formattedAge}
                {gestationalInfo.dueDate ? ` · HPL: ${gestationalInfo.dueDate}` : ""}
              </span>
            </p>
          )}
        </div>
        {isHamilPertama && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <Label className="text-xs font-bold text-slate-800 block">
              Sudah berapa lama Bunda menikah sebelum hamil ini?
            </Label>
            <RadioGroup
              value={formData.lama_menikah ?? ""}
              onValueChange={(val) => setFormData({ ...formData, lama_menikah: val as '<4' | '>=4' })}
              className="flex gap-5 pt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="<4" id="menikah-cepat" />
                <Label htmlFor="menikah-cepat" className="text-xs cursor-pointer">Kurang dari 4 tahun</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value=">=4" id="menikah-lama" />
                <Label htmlFor="menikah-lama" className="text-xs cursor-pointer">4 tahun atau lebih</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        {!isHamilPertama && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <Label className="text-xs font-bold text-slate-800 block">
              Jarak kehamilan ini dengan kehamilan sebelumnya?
            </Label>
            <RadioGroup
              value={formData.jarak_kehamilan ?? ""}
              onValueChange={(val) => setFormData({ ...formData, jarak_kehamilan: val as '<2' | '2-10' | '>10' })}
              className="flex flex-col gap-1.5 pt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="<2" id="jarak-cepat" />
                <Label htmlFor="jarak-cepat" className="text-xs cursor-pointer">Kurang dari 2 tahun</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-10" id="jarak-normal" />
                <Label htmlFor="jarak-normal" className="text-xs cursor-pointer">2 sampai 10 tahun (Normal)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value=">10" id="jarak-lama" />
                <Label htmlFor="jarak-lama" className="text-xs cursor-pointer">Lebih dari 10 tahun</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="jumlah_anak_hidup">Jumlah Anak Hidup Saat Ini</Label>
            <NumberStepper
              id="jumlah_anak_hidup"
              min={0}
              max={20}
              value={formData.jumlah_anak_hidup ?? 0}
              onChange={(val) => setFormData({ ...formData, jumlah_anak_hidup: val })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tinggi_badan">Tinggi Badan (cm)</Label>
            <NumberStepper
              id="tinggi_badan"
              min={100}
              max={220}
              placeholder="155"
              value={formData.tinggi_badan || 155}
              onChange={(val) => setFormData({ ...formData, tinggi_badan: val })}
              suffix="cm"
              className="mt-1"
            />
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
          <Label className="text-xs font-bold text-slate-800 block">
            Apakah Bunda pernah mengalami keguguran sebelumnya?
          </Label>
          <RadioGroup
            value={formData.riwayat_keguguran ? "true" : "false"}
            onValueChange={(val) => setFormData({ ...formData, riwayat_keguguran: val === "true" })}
            className="flex gap-5 pt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="keguguran-no" />
              <Label htmlFor="keguguran-no" className="text-xs cursor-pointer">Tidak pernah</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="keguguran-yes" />
              <Label htmlFor="keguguran-yes" className="text-xs cursor-pointer">Pernah keguguran</Label>
            </div>
          </RadioGroup>
        </div>
        {!isHamilPertama && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <Label className="text-xs font-bold text-slate-800 block">
              Pada persalinan sebelumnya, adakah kejadian berikut? (boleh pilih lebih dari satu)
            </Label>
            <div className="space-y-2 pt-1">
              {[
                { value: "tang_vakum", label: "Bayi dilahirkan dengan ditarik tang / vakum" },
                { value: "plasenta_manual", label: "Ari-ari / plasenta harus dikeluarkan manual (dirogoh)" },
                { value: "infus_transfusi", label: "Diberi infus / transfusi darah karena pendarahan" },
              ].map(({ value, label }) => (
                <Checkbox
                  key={value}
                  id={`bermasalah-${value}`}
                  checked={(formData.riwayat_persalinan_bermasalah ?? []).includes(value)}
                  onCheckedChange={() => toggleCheckbox("riwayat_persalinan_bermasalah", value)}
                  label={label}
                />
              ))}
            </div>
          </div>
        )}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
          <Label className="text-xs font-bold text-slate-800 block">
            Apakah Bunda pernah melahirkan melalui Operasi Sesar (SC) sebelumnya?
          </Label>
          <RadioGroup
            value={formData.riwayat_sc_kehamilan ? "true" : "false"}
            onValueChange={(val) => setFormData({ ...formData, riwayat_sc_kehamilan: val === "true" })}
            className="flex gap-5 pt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="sc-no" />
              <Label htmlFor="sc-no" className="text-xs cursor-pointer">Tidak / Belum pernah</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="sc-yes" />
              <Label htmlFor="sc-yes" className="text-xs cursor-pointer">Pernah operasi SC</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
