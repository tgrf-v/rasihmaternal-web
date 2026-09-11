import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { ArrowLeft, CheckCircle2, AlertTriangle, Lock, Eye, EyeOff } from "lucide-react";

interface ProfilPasswordFormProps {
  onBack: () => void;
}

export function ProfilPasswordForm({ onBack }: ProfilPasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { data, setData, errors, put, reset, processing } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 4000);
      },
      onError: () => {
        setIsSuccess(false);
      },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header / Back Button */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBack}
          className="rounded-full h-9 w-9 p-0 flex items-center justify-center border-slate-200 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4 text-slate-700" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Ubah Kata Sandi
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Perbarui kata sandi akun Anda demi menjaga keamanan data pemeriksaan
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {isSuccess && (
        <Alert className="rounded-2xl bg-emerald-50 border-emerald-200 text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="font-bold text-xs">Berhasil!</AlertTitle>
          <AlertDescription className="text-xs text-emerald-700">
            Kata sandi akun Anda telah berhasil diperbarui.
          </AlertDescription>
        </Alert>
      )}

      {/* General Error Alert */}
      {errors.current_password && (
        <Alert className="rounded-2xl bg-rose-50 border-rose-200 text-rose-800">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <AlertTitle className="font-bold text-xs">Peringatan</AlertTitle>
          <AlertDescription className="text-xs text-rose-700">
            {errors.current_password}
          </AlertDescription>
        </Alert>
      )}

      {/* Form Card */}
      <Card className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Password */}
          <div>
            <Label htmlFor="current_password" className="text-xs font-bold text-slate-700">
              Kata Sandi Saat Ini <span className="text-rose-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="current_password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi saat ini..."
                value={data.current_password}
                onChange={(e) => setData("current_password", e.target.value)}
                className="pl-10 pr-10 rounded-full"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 focus:outline-none"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.current_password}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="new_password" className="text-xs font-bold text-slate-700">
              Kata Sandi Baru <span className="text-rose-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter..."
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="pl-10 pr-10 rounded-full"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 focus:outline-none"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <Label htmlFor="password_confirmation" className="text-xs font-bold text-slate-700">
              Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi kata sandi baru..."
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                className="pl-10 pr-10 rounded-full"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={processing}
              className="rounded-full px-5 text-slate-700 font-medium"
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={processing}
              isLoading={processing}
              className="rounded-full px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Simpan Kata Sandi
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
