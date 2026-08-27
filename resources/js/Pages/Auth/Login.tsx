import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
  LogIn,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Login form
  const loginForm = useForm<LoginFormData>({
    email: "",
    password: "",
    remember: true,
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginForm.post(route("login"), {
      onFinish: () => loginForm.reset("password"),
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerForm.post(route("register"), {
      onFinish: () => registerForm.reset("password", "password_confirmation"),
    });
  };

  const isLoading = mode === "login" ? loginForm.processing : registerForm.processing;
  const serverErrors = mode === "login" ? loginForm.errors : registerForm.errors;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-stone-50 to-sage-100/60 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Subtle Ornaments */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login / Register Card */}
      <Card className="w-full max-w-md rounded-3xl border-emerald-100 shadow-soft-lg bg-white/95 backdrop-blur-md overflow-hidden">
        
        {/* Header Branding */}
        <CardHeader className="text-center pt-6 pb-2 px-6 space-y-2">
          <div className="mx-auto flex justify-center mb-1">
            <ApplicationLogo className="h-12 w-auto object-contain" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>{mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}</span>
            </CardTitle>
            <div className="mt-1 space-y-0.5">
              <CardDescription className="text-xs font-bold text-emerald-800">
                RASIH Maternal
              </CardDescription>
              <p className="text-[11px] font-medium text-slate-500 leading-snug">
                Risk Assessment and Screening for Integrated Maternal Health
              </p>
              <p className="text-[11px] text-slate-400 italic">
                &ldquo;Kenali Risiko, Lindungi Ibu dan Bayi&rdquo;
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pt-2 pb-6 space-y-4">

          {/* Server-side error display */}
          {Object.keys(serverErrors).length > 0 && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium space-y-1">
              {Object.values(serverErrors).map((error, idx) => (
                <p key={idx}>{error}</p>
              ))}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email Field */}
              <div>
                <Label htmlFor="email_input" className="text-xs font-bold text-slate-700">
                  Alamat Email <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="email_input"
                    type="email"
                    placeholder="nama@email.com"
                    value={loginForm.data.email}
                    onChange={(e) => loginForm.setData("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password_input" className="text-xs font-bold text-slate-700">
                    Password <span className="text-rose-500">*</span>
                  </Label>
                </div>

                <div className="relative mt-1.5">
                  <Input
                    id="password_input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password..."
                    value={loginForm.data.password}
                    onChange={(e) => loginForm.setData("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember_me"
                    checked={loginForm.data.remember}
                    onCheckedChange={(checked) => loginForm.setData("remember", Boolean(checked))}
                  />
                  <Label htmlFor="remember_me" className="text-xs text-slate-600 cursor-pointer font-medium">
                    Ingat saya
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full font-bold text-sm gap-2 shadow-soft-md mt-2 bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <LogIn className="h-4 w-4" />
                <span>Masuk Sekarang</span>
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Nama Field */}
              <div className="animate-fadeIn">
                <Label htmlFor="nama_register" className="text-xs font-bold text-slate-700">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="nama_register"
                    type="text"
                    placeholder="Masukkan nama lengkap..."
                    value={registerForm.data.name}
                    onChange={(e) => registerForm.setData("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="reg_email_input" className="text-xs font-bold text-slate-700">
                  Alamat Email <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="reg_email_input"
                    type="email"
                    placeholder="nama@email.com"
                    value={registerForm.data.email}
                    onChange={(e) => registerForm.setData("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="reg_password_input" className="text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="reg_password_input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password..."
                    value={registerForm.data.password}
                    onChange={(e) => registerForm.setData("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="animate-fadeIn">
                <Label htmlFor="confirm_password_input" className="text-xs font-bold text-slate-700">
                  Konfirmasi Password <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirm_password_input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ulangi password..."
                    value={registerForm.data.password_confirmation}
                    onChange={(e) => registerForm.setData("password_confirmation", e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full font-bold text-sm gap-2 shadow-soft-md mt-2 bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <UserPlus className="h-4 w-4" />
                <span>Daftar Sekarang</span>
              </Button>
            </form>
          )}
        </CardContent>

        {/* Dynamic Footer Toggle */}
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 text-center justify-center">
          {mode === "login" ? (
            <p className="text-xs text-slate-500">
              Belum memiliki akun?{" "}
              <button
                onClick={() => setMode("register")}
                className="font-bold text-emerald-700 hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Sudah memiliki akun?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-bold text-emerald-700 hover:underline"
              >
                Masuk sekarang
              </button>
            </p>
          )}
        </CardFooter>

      </Card>
    </div>
  );
}
