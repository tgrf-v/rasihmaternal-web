import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { NumberStepper } from "@/Components/ui/number-stepper";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Progress } from "@/Components/ui/progress";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { ScreeningInput, ScreeningResult } from "@/types/screening";
import {
  Activity,
  User,
  Heart,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  RefreshCw,
  Info,
  Baby,
} from "lucide-react";

import { PageProps } from "@/types";

export default function PersalinanScreening() {
  const { auth, flash, screeningResult: propResult } = usePage<PageProps<{
    screeningResult?: ScreeningResult;
  }>>().props;

  const serverResult = flash?.screeningResult || propResult;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [persalinanResult, setPersalinanResult] = useState<ScreeningResult | null>(null);
  const [rightPanelView, setRightPanelView] = useState<"summary" | "detail">("summary");

  const [formData, setFormData] = useState<ScreeningInput & {
    ada_riwayat_sc?: boolean;
  }>({
    nama_pasien: auth?.user?.name || "",
    nik: auth?.user?.nik || "",
    umur: 27,
    pekerjaan: auth?.user?.pekerjaan || "Ibu Rumah Tangga",
    pendidikan: auth?.user?.pendidikan || "SLTA",
    gravida: 1,
    paritas: 0,
    abortus: 0,
    sistolik: 120,
    diastolik: 80,
    edema_level: "none",
    keluhan_spesifik: [],
    sudah_dapat_treatment: false,
    detail_treatment: "",
    tipe_screening: "persalinan",
    wilayah_puskesmas: auth?.user?.puskesmas || "",
    ada_riwayat_sc: false,
  });

  useEffect(() => {
    if (serverResult) {
      setPersalinanResult(serverResult);
      setHasScreened(true);
      setRightPanelView("summary");
    }
  }, [serverResult]);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama_pasien.trim()) newErrors.nama_pasien = "Nama pasien wajib diisi";
    if (!formData.umur || formData.umur < 12 || formData.umur > 60) {
      newErrors.umur = "Umur valid antara 12 - 60 tahun";
    }
    if ((formData.gravida ?? 1) < 1) newErrors.gravida = "Jumlah kehamilan (Gravida) minimal 1";
    if (formData.paritas < 0 || formData.paritas > 20) {
      newErrors.paritas = "Jumlah paritas tidak valid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrev = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      handleNext(e);
      return;
    }
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);

    const payload = {
      ...formData,
      jenis_persalinan: formData.ada_riwayat_sc ? "Sectio Sesarea" : "Persalinan Pervaginam",
      keluhan_spesifik: formData.ada_riwayat_sc ? ["riwayat_sc"] : [],
    };

    router.post(route("screening.store"), payload as any, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsLoading(false);
        setErrors({});
      },
      onError: (serverErrors) => {
        setIsLoading(false);
        setErrors(serverErrors as Record<string, string>);
      },
    });
  };

  const handleRescreen = () => {
    setHasScreened(false);
    setCurrentStep(1);
    setRightPanelView("summary");
  };

  return (
    <BundaSehatLayout activeNav="persalinan">
      <div className="max-w-[1240px] mx-auto px-0 sm:px-6 lg:px-8 py-0 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-65px)] flex flex-col justify-center">
        
        {/* Modern Split Card with Image Fade Overlay (2 Kolom) */}
        <div className="w-full mx-auto bg-white rounded-none border-0 sm:border border-slate-200 overflow-hidden h-full lg:h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            
            {/* Kolom Kiri (Gambar Static - 50%) */}
            <div className="relative lg:col-span-6 h-[240px] lg:h-full overflow-hidden">
              <img
                src="/images/persalinan-screening.webp"
                alt="Screening Persalinan"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white lg:hidden" />
            </div>

            {/* Kolom Kanan (Konten Utama & Form - 50% - Scrollable) */}
            <div className="lg:col-span-6 lg:h-[calc(100vh-65px)] h-auto overflow-y-auto overflow-x-hidden">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-full bg-white relative z-10">
              
              {/* Header Kolom Kanan */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  Screening Persalinan
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {hasScreened
                    ? "Hasil kesiapan persalinan & rekomendasi Faskes rujukan."
                    : "Skrining kesiapan persalinan mandiri & penentuan tempat persalinan aman."}
                </p>
              </div>

              {/* Dynamic Area */}
              {hasScreened && persalinanResult ? (
                rightPanelView === "detail" ? (
                  /* ============================================================ */
                  /* GAMBAR 4: VIEW DETAIL PERHITUNGAN SKOR PERSALINAN            */
                  /* ============================================================ */
                  <div className="space-y-5 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => setRightPanelView("summary")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors mb-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Kembali ke Hasil Ringkas</span>
                    </button>

                    <Card className="border border-slate-200/80 shadow-soft-sm bg-white rounded-2xl p-5 space-y-4 text-center">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Level risiko Persalinan Pasien: <span className="font-semibold text-slate-700">{formData.umur || 27} thn</span>
                        </p>
                        <h2 className={`text-2xl font-bold tracking-tight mt-1 ${
                          persalinanResult.kategori_risiko === "KRR"
                            ? "text-emerald-700"
                            : persalinanResult.kategori_risiko === "KRT"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}>
                          {persalinanResult.kategori_risiko === "KRR"
                            ? "Risiko Rendah / Ringan"
                            : persalinanResult.kategori_risiko === "KRT"
                            ? "Risiko Tinggi / Sedang"
                            : "Risiko Sangat Tinggi / Berat"}
                        </h2>
                      </div>

                      {/* Tri-Color Segmented Gauge Bar */}
                      <div className="relative w-full max-w-sm mx-auto pt-2 pb-6">
                        <div className="h-4 w-full rounded-full flex overflow-hidden">
                          <div className="flex-1 bg-[#64B565]" />
                          <div className="flex-1 bg-[#F7D154]" />
                          <div className="flex-1 bg-[#F83838]" />
                        </div>
                        {(() => {
                          const score = persalinanResult.total_skor || persalinanResult.skor_poedji_rochjati || 2;
                          const percent = Math.min(Math.max((score / 20) * 100, 8), 92);
                          return (
                            <div
                              className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
                              style={{ left: `${percent}%` }}
                            >
                              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
                              <div className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                                {score}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </Card>

                    {/* Cyan Banner */}
                    <div className="p-3.5 px-5 rounded-full bg-cyan-50 border border-cyan-100/80 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-cyan-900">
                        <Info className="h-4 w-4 text-cyan-600 shrink-0" />
                        <span className="text-[11px] sm:text-xs">Gunakan laporan rincian perhitungan ini untuk referensi rujukan Anda.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="font-bold text-cyan-700 hover:text-cyan-900 hover:underline shrink-0 text-xs"
                      >
                        Cetak
                      </button>
                    </div>

                    {/* Section: Perhitungan Skor */}
                    <div className="space-y-2.5 pt-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Perhitungan skor risiko</h4>
                      <div className="space-y-2 pt-1">
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
                          <div className="h-4 w-4 rounded bg-[#64B565] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs sm:text-sm text-slate-900">Skor 2 - Risiko Rendah (KRR)</p>
                            <p className="text-xs text-slate-500">Persalinan normal fisiologis di BPM / Puskesmas.</p>
                          </div>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
                          <div className="h-4 w-4 rounded bg-[#F7D154] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs sm:text-sm text-slate-900">Skor 6-10 - Risiko Tinggi (KRT)</p>
                            <p className="text-xs text-slate-500">Pengawasan Bidan & Dokter Umum Puskesmas PONED.</p>
                          </div>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
                          <div className="h-4 w-4 rounded bg-[#F83838] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs sm:text-sm text-slate-900">Skor &ge; 12 - Risiko Sangat Tinggi (KRST)</p>
                            <p className="text-xs text-slate-500">Rujukan terencana Rumah Sakit PONEK / Dokter Sp.OG.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informasi Umum */}
                    <div className="space-y-2.5 pt-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Informasi umum</h4>
                      <div className="space-y-2">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-slate-700">Umur</span>
                          <span className="font-bold text-rose-600">
                            {formData.umur} thn : {formData.umur < 20 || formData.umur >= 35 ? "4 poin" : "2 poin"}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-slate-700">Jumlah Hamil (Paritas)</span>
                          <span className="font-bold text-rose-600">
                            Hamil ke-{formData.gravida || 1} : {formData.paritas >= 4 ? "4 poin" : "0 poin"}
                          </span>
                        </div>
                        {formData.ada_riwayat_sc && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Riwayat SC Sebelumnya</span>
                            <span className="font-bold text-rose-600">Pernah Operasi Caesar : 8 poin</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="pt-3 flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRescreen}
                        className="flex-1 rounded-full text-xs font-bold py-2.5"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        <span>Screening Ulang</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => router.visit("/kamus")}
                        className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5"
                      >
                        <span>Buka Kamus Terapi</span>
                      </Button>
                    </div>

                  </div>
                ) : (
                  /* ============================================================ */
                  /* GAMBAR 3: VIEW HASIL RINGKAS SKOR PERSALINAN                 */
                  /* ============================================================ */
                  <div className="space-y-5 animate-fadeIn">
                    <Card className="border border-slate-200/80 shadow-soft-sm bg-white rounded-3xl p-5 sm:p-6 space-y-3.5 text-center">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Level risiko Persalinan Pasien: <span className="font-semibold text-slate-700">{formData.umur || 27} thn</span>
                        </p>
                        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
                          persalinanResult.kategori_risiko === "KRR"
                            ? "text-emerald-700"
                            : persalinanResult.kategori_risiko === "KRT"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}>
                          {persalinanResult.kategori_risiko === "KRR"
                            ? "Risiko Rendah / Ringan"
                            : persalinanResult.kategori_risiko === "KRT"
                            ? "Risiko Tinggi / Sedang"
                            : "Risiko Sangat Tinggi / Berat"}
                        </h2>
                      </div>

                      {/* Tri-Color Segmented Gauge Bar */}
                      <div className="relative w-full max-w-sm mx-auto pt-2 pb-6">
                        <div className="h-4 w-full rounded-full flex overflow-hidden">
                          <div className="flex-1 bg-[#64B565]" />
                          <div className="flex-1 bg-[#F7D154]" />
                          <div className="flex-1 bg-[#F83838]" />
                        </div>
                        {(() => {
                          const score = persalinanResult.total_skor || persalinanResult.skor_poedji_rochjati || 2;
                          const percent = Math.min(Math.max((score / 20) * 100, 8), 92);
                          return (
                            <div
                              className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
                              style={{ left: `${percent}%` }}
                            >
                              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
                              <div className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                                {score}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <p className="text-xs font-semibold text-slate-600">
                        Skor KSPR: <strong className="text-slate-900 font-bold">{persalinanResult.total_skor || persalinanResult.skor_poedji_rochjati || 2} Poin</strong>
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <button
                          type="button"
                          onClick={() => setRightPanelView("detail")}
                          className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
                        >
                          Lihat Perhitungan &rarr;
                        </button>
                        <button
                          type="button"
                          onClick={handleRescreen}
                          className="font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Cek Ulang</span>
                        </button>
                      </div>
                    </Card>

                    {/* Rekomendasi Tempat */}
                    <div className="p-4 sm:p-5 rounded-3xl bg-rose-50/60 border border-rose-100/90 space-y-1">
                      <h4 className="font-bold text-rose-700 text-xs sm:text-sm">
                        Rekomendasi Tempat & Penolong Persalinan
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                        {persalinanResult.rekomendasi_faskes || "Puskesmas Rawat Inap / PONED (Bidan & Dokter Umum)"}
                      </p>
                    </div>

                    {/* Rincian Faktor */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        Rincian Faktor Risiko Terdeteksi:
                      </h4>

                      <div className="space-y-2">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-slate-700">Skor Awal Persalinan</span>
                          <span className="font-bold text-rose-600">+ 2 Poin</span>
                        </div>

                        {formData.umur < 20 && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Usia Terlalu Muda (&lt;20 Tahun)</span>
                            <span className="font-bold text-rose-600">+ 4 Poin</span>
                          </div>
                        )}

                        {formData.umur >= 35 && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Usia Terlalu Tua (&ge;35 Tahun)</span>
                            <span className="font-bold text-rose-600">+ 4 Poin</span>
                          </div>
                        )}

                        {formData.paritas >= 4 && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Grande Multipara (Pernah Melahirkan &ge;4 Kali)</span>
                            <span className="font-bold text-rose-600">+ 4 Poin</span>
                          </div>
                        )}

                        {formData.ada_riwayat_sc && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Pernah Operasi Caesar (Seksio Sesarea)</span>
                            <span className="font-bold text-rose-600">+ 8 Poin</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Saran Terapi */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs sm:text-sm">
                        <Heart className="h-4 w-4" />
                        <span>Saran Terapi Komplementer Persalinan</span>
                      </div>

                      <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="oxytocin" className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs">
                          <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
                            Pijat Punggung & Relaksasi Napas Pembukaan
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
                            Memfasilitasi kontraksi yang teratur dan mengurangi rasa nyeri kala 1 persalinan.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                  </div>
                )
              ) : (
                /* FORM INPUT PERSALINAN IBU HAMIL */
                <div className="space-y-5">
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                      <span className={currentStep >= 1 ? "text-emerald-700 font-bold" : ""}>
                        1. Data Diri & Obstetri
                      </span>
                      <span className={currentStep >= 2 ? "text-emerald-700 font-bold" : ""}>
                        2. Riwayat Persalinan Lalu
                      </span>
                    </div>
                    <Progress value={(currentStep / 2) * 100} variant="default" className="h-2" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {Object.keys(errors).length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium space-y-1 animate-fadeIn">
                        {Object.values(errors).map((err, idx) => (
                          <p key={idx} className="flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                            <span>{err}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    {/* STEP 1 */}
                    {currentStep === 1 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <User className="h-4 w-4 text-emerald-700" />
                            <span>Langkah 1: Data Diri & Riwayat Kehamilan</span>
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="nama_pasien">Nama Lengkap Pasien <span className="text-rose-600">*</span></Label>
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
                              <Label htmlFor="umur">Usia Bunda (Tahun) <span className="text-rose-600">*</span></Label>
                              <Input
                                id="umur"
                                type="number"
                                min={12}
                                max={60}
                                value={formData.umur || ""}
                                onChange={(e) => setFormData({ ...formData, umur: Number(e.target.value) })}
                                error={errors.umur}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="pekerjaan">Status Pekerjaan</Label>
                              <Select
                                value={formData.pekerjaan || "Ibu Rumah Tangga"}
                                onValueChange={(val) => setFormData({ ...formData, pekerjaan: val })}
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
                                  <SelectItem value="Pelajar/Mahasiswa">Pelajar / Mahasiswa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
                            <Select
                              value={formData.pendidikan || "SLTA"}
                              onValueChange={(val) => setFormData({ ...formData, pendidikan: val })}
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
                                <span className="text-[11px] text-slate-600 block mb-1">Hamil ke- (G)</span>
                                <NumberStepper
                                  id="gravida"
                                  min={1}
                                  max={20}
                                  value={formData.gravida || 1}
                                  onChange={(val) => setFormData({ ...formData, gravida: val })}
                                />
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-600 block mb-1">Kelahiran (P)</span>
                                <NumberStepper
                                  id="paritas"
                                  min={0}
                                  max={20}
                                  value={formData.paritas ?? 0}
                                  onChange={(val) => setFormData({ ...formData, paritas: val })}
                                />
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-600 block mb-1">Keguguran (A)</span>
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
                    )}

                    {/* STEP 2 */}
                    {currentStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Baby className="h-4 w-4 text-rose-600" />
                            <span>Langkah 2: Riwayat Persalinan Sebelumnya</span>
                          </h3>
                        </div>

                        <div className="space-y-3.5">
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                            <Label className="text-xs font-bold text-slate-800 block">
                              Apakah Bunda pernah melahirkan melalui Operasi Caesar (SC)?
                            </Label>
                            <RadioGroup
                              value={formData.ada_riwayat_sc ? "true" : "false"}
                              onValueChange={(val) => setFormData({
                                ...formData,
                                ada_riwayat_sc: val === "true",
                              })}
                              className="flex gap-4 pt-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="sc-no-p" />
                                <Label htmlFor="sc-no-p" className="text-xs cursor-pointer">Belum Pernah (Normal)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="sc-yes-p" />
                                <Label htmlFor="sc-yes-p" className="text-xs cursor-pointer">Pernah Operasi Caesar</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
                            <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              Pemeriksaan pembukaan jalan lahir, his kontraksi, dan kondisi air ketuban akan diperiksa langsung oleh Bidan di ruang persalinan.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="pt-4 flex items-center justify-between gap-3">
                      {currentStep > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrev}
                          className="rounded-full text-xs font-bold px-5"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          <span>Sebelumnya</span>
                        </Button>
                      ) : <div />}

                      {currentStep < 2 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 ml-auto"
                        >
                          <span>Lanjut</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-8 ml-auto shadow-soft-sm"
                        >
                          {isLoading ? "Menghitung Kesiapan..." : "Lihat Hasil Kesiapan"}
                        </Button>
                      )}
                    </div>

                  </form>
                </div>
              )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </BundaSehatLayout>
  );
}
