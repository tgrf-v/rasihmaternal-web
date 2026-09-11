import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Mail, ArrowLeft, CheckCircle2, AlertTriangle, Send } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("password.email"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-stone-50 to-sage-100/60 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      <Head title="Lupa Kata Sandi - RASIH Maternal" />

      {/* Background Subtle Ornaments */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <Card className="w-full max-w-md rounded-3xl border-emerald-100 shadow-soft-lg bg-white/95 backdrop-blur-md overflow-hidden">
        <CardHeader className="text-center pt-6 pb-2 px-6 space-y-2">
          <div className="mx-auto flex justify-center mb-1">
            <ApplicationLogo className="h-12 w-auto object-contain" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              Lupa Kata Sandi?
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Masukkan alamat email Anda untuk menerima tautan pemulihan kata sandi akun
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-3 space-y-4">
          {/* Status / Success Alert */}
          {status && (
            <Alert className="rounded-2xl bg-emerald-50 border-emerald-200 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="font-bold text-xs">Email Terkirim</AlertTitle>
              <AlertDescription className="text-xs text-emerald-700">
                {status}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {errors.email && (
            <Alert className="rounded-2xl bg-rose-50 border-rose-200 text-rose-800">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <AlertTitle className="font-bold text-xs">Gagal Mengirim</AlertTitle>
              <AlertDescription className="text-xs text-rose-700">
                {errors.email}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Alamat Email Terdaftar <span className="text-rose-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh: nama@email.com"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="pl-10 rounded-full"
                  required
                  autoFocus
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={processing}
              isLoading={processing}
              className="w-full rounded-full font-bold text-sm gap-2 shadow-soft-md bg-emerald-700 hover:bg-emerald-800 text-white mt-2"
            >
              <Send className="h-4 w-4" />
              <span>Kirim Tautan Reset Password</span>
            </Button>
          </form>

          {/* Back to Login */}
          <div className="pt-2 text-center">
            <Link
              href={route("login")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Halaman Masuk</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
