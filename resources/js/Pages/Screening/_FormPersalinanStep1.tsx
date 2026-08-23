import React from "react";
import { Input } from "@/Components/ui/input";
import { NumberStepper } from "@/Components/ui/number-stepper";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { User } from "lucide-react";

export interface PersalinanFormData {
  nama_pasien: string;
  nik: string;
  umur: number;
  pekerjaan: string;
  pendidikan: string;
  gravida: number;
  paritas: number;
  abortus: number;
}

interface FormPersalinanStep1Props {
  formData: PersalinanFormData;
  setFormData: React.Dispatch<React.SetStateAction<PersalinanFormData>>;
  errors: Record<string, string>;
}

export function FormPersalinanStep1({
  formData,
  setFormData,
  errors,
}: FormPersalinanStep1Props) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="h-4 w-4 text-emerald-700" />
          <span>Langkah 1: Identitas &amp; Riwayat Kehamilan</span>
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="nama_pasien">
            Nama Lengkap Pasien <span className="text-rose-600">*</span>
          </Label>
          <Input
            id="nama_pasien"
            placeholder="Masukkan nama lengkap Bunda..."
            value={formData.nama_pasien}
            onChange={(e) =>
              setFormData({ ...formData, nama_pasien: e.target.value })
            }
            error={errors.nama_pasien}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="umur">
              Usia Bunda (Tahun) <span className="text-rose-600">*</span>
            </Label>
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
          <div>
            <Label htmlFor="pekerjaan">Status Pekerjaan</Label>
            <Select
              value={formData.pekerjaan || "Ibu Rumah Tangga"}
              onValueChange={(val) =>
                setFormData({ ...formData, pekerjaan: val })
              }
            >
              <SelectTrigger id="pekerjaan" className="mt-1">
                <SelectValue placeholder="Pilih pekerjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ibu Rumah Tangga">Ibu Rumah Tangga</SelectItem>
                <SelectItem value="Karyawan Swasta">Karyawan Swasta</SelectItem>
                <SelectItem value="PNS">PNS / ASN</SelectItem>
                <SelectItem value="Wiraswasta">Wiraswasta / Usaha</SelectItem>
                <SelectItem value="Petani/Buruh">Buruh / Petani</SelectItem>
                <SelectItem value="Pelajar/Mahasiswa">
                  Pelajar / Mahasiswa
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
          <Select
            value={formData.pendidikan || "SLTA"}
            onValueChange={(val) =>
              setFormData({ ...formData, pendidikan: val })
            }
          >
            <SelectTrigger id="pendidikan" className="mt-1">
              <SelectValue placeholder="Pilih pendidikan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SD">SD / Sederajat</SelectItem>
              <SelectItem value="SLTP">SLTP / SMP</SelectItem>
              <SelectItem value="SLTA">SLTA / SMA / SMK</SelectItem>
              <SelectItem value="DIPLOMA">Diploma (D3 / D4)</SelectItem>
              <SelectItem value="SARJANA">Sarjana (S1)</SelectItem>
              <SelectItem value="MAGISTER">Magister (S2 / S3)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
          <Label className="text-xs font-bold text-slate-800 block">
            Riwayat Kehamilan (Gravida - Paritas - Abortus)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <span className="text-[11px] text-slate-600 block mb-1">
                Hamil ke- (G)
              </span>
              <NumberStepper
                id="gravida"
                min={1}
                max={20}
                value={formData.gravida || 1}
                onChange={(val) => setFormData({ ...formData, gravida: val })}
                error={errors.gravida}
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-600 block mb-1">
                Kelahiran (P)
              </span>
              <NumberStepper
                id="paritas"
                min={0}
                max={20}
                value={formData.paritas ?? 0}
                onChange={(val) => setFormData({ ...formData, paritas: val })}
                error={errors.paritas}
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-600 block mb-1">
                Keguguran (A)
              </span>
              <NumberStepper
                id="abortus"
                min={0}
                max={15}
                value={formData.abortus || 0}
                onChange={(val) => setFormData({ ...formData, abortus: val })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
