import React, { useRef, useState } from "react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { DatePicker } from "@/Components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ArrowLeft, CheckCircle2, AlertTriangle, Camera, Trash2, User } from "lucide-react";
import { ProfileFormData } from "./types";

interface ProfilEditFormProps {
  data: ProfileFormData;
  setData: <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => void;
  errors: Partial<Record<keyof ProfileFormData, string>>;
  processing: boolean;
  isSaved: boolean;
  initialPhoto?: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const PENDIDIKAN_OPTIONS = [
  { label: "Tidak / Belum Sekolah", value: "Tidak / Belum Sekolah" },
  { label: "SD / Sederajat", value: "SD" },
  { label: "SMP / Sederajat", value: "SMP" },
  { label: "SMA / SMK / Sederajat", value: "SMA/SMK" },
  { label: "Diploma (D1 - D4)", value: "Diploma" },
  { label: "Sarjana (S1)", value: "S1" },
  { label: "Magister / Doktor (S2 / S3)", value: "S2/S3" },
];

export function ProfilEditForm({
  data,
  setData,
  errors,
  processing,
  isSaved,
  initialPhoto,
  onSubmit,
  onBack,
}: ProfilEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPhoto || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("foto_profil", file);
      setData("hapus_foto", false);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setData("foto_profil", null);
    setData("hapus_foto", true);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar Navigation */}
      <div className="flex items-center justify-between relative py-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
          Edit Data Diri
        </h2>
      </div>

      {/* Form Container Card */}
      <Card className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-5">
        <form onSubmit={onSubmit} className="space-y-5">
          {isSaved && (
            <Alert variant="success" className="rounded-2xl animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Berhasil!</AlertTitle>
              <AlertDescription className="text-emerald-800">
                Data diri berhasil disimpan ke database!
              </AlertDescription>
            </Alert>
          )}

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="rounded-2xl animate-fadeIn">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Terjadi kesalahan:</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {Object.values(errors).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Section: Upload Foto Profil */}
          <div className="p-4 rounded-3xl bg-slate-50/70 border border-slate-100/90 flex flex-col sm:flex-row items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-soft-sm bg-slate-100 text-slate-600 flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
                )}
              </div>
            </div>

            {/* Upload & Remove Controls */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Foto Profil
                </h4>
                <p className="text-[11px] text-slate-500">
                  Format JPG, PNG, atau WebP (Maksimal 2MB)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={handleTriggerUpload}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-bold px-4 h-9 gap-1.5 border-slate-200 hover:bg-slate-100"
                >
                  <Camera className="h-3.5 w-3.5 text-emerald-700" />
                  <span>{previewUrl ? "Ubah Foto" : "Unggah Foto"}</span>
                </Button>

                {previewUrl && (
                  <Button
                    type="button"
                    onClick={handleRemovePhoto}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-bold px-3.5 h-9 gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </Button>
                )}
              </div>

              {errors.foto_profil && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.foto_profil}</p>
              )}
            </div>
          </div>

          {/* Baris 1: Nama Lengkap */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-xs font-bold text-slate-700">
              Nama lengkap <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="profile-name"
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Nama Lengkap"
              required
              error={errors.name}
              className="rounded-full h-11 px-5 text-xs sm:text-sm text-slate-900"
            />
          </div>

          {/* Baris 2: Nomor Induk Kependudukan (NIK) */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-nik" className="text-xs font-bold text-slate-700">
              Nomor Induk Kependudukan (NIK)
            </Label>
            <Input
              id="profile-nik"
              type="text"
              maxLength={16}
              value={data.nik}
              onChange={(e) => setData("nik", e.target.value)}
              placeholder="16 digit NIK KTP"
              error={errors.nik}
              className="rounded-full h-11 px-5 text-xs sm:text-sm text-slate-900"
            />
          </div>

          {/* Baris 3: Nomor WhatsApp / Handphone */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-phone" className="text-xs font-bold text-slate-700">
              Nomor WhatsApp / handphone
            </Label>
            <Input
              id="profile-phone"
              type="tel"
              value={data.no_telepon}
              placeholder="081200000002"
              onChange={(e) => setData("no_telepon", e.target.value)}
              error={errors.no_telepon}
              className="rounded-full h-11 px-5 text-xs sm:text-sm text-slate-900"
            />
          </div>

          {/* Baris 4: Grid 2 Kolom di Desktop (Tanggal Lahir & Pendidikan) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kolom Kiri: Tanggal Lahir (DatePicker dengan selector tahun) */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-dob" className="text-xs font-bold text-slate-700">
                Tanggal lahir
              </Label>
              <DatePicker
                id="profile-dob"
                value={data.tanggal_lahir}
                onChange={(dateString) => setData("tanggal_lahir", dateString)}
                placeholder="Pilih..."
                error={errors.tanggal_lahir}
              />
            </div>

            {/* Kolom Kanan: Pendidikan (Select) */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-education" className="text-xs font-bold text-slate-700">
                Pendidikan
              </Label>
              <Select
                value={data.pendidikan || ""}
                onValueChange={(val) => setData("pendidikan", val)}
              >
                <SelectTrigger id="profile-education" className="rounded-full h-11 px-5 text-xs sm:text-sm text-slate-900 border-slate-200">
                  <SelectValue placeholder="Pilih..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  {PENDIDIKAN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs sm:text-sm rounded-xl">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pendidikan && (
                <p className="text-xs font-medium text-rose-600 animate-fadeIn pl-3">
                  {errors.pendidikan}
                </p>
              )}
            </div>
          </div>

          {/* Baris 5: Pekerjaan */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-job" className="text-xs font-bold text-slate-700">
              Pekerjaan
            </Label>
            <Input
              id="profile-job"
              type="text"
              value={data.pekerjaan}
              placeholder="Contoh: Ibu rumah tangga"
              onChange={(e) => setData("pekerjaan", e.target.value)}
              error={errors.pekerjaan}
              className="rounded-full h-11 px-5 text-xs sm:text-sm text-slate-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="rounded-full px-6 h-11 border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 hover:text-rose-700 transition-colors uppercase shrink-0"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={processing}
              className="rounded-full px-7 h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wide text-center shadow-soft-sm transition-colors shrink-0"
            >
              {processing ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
