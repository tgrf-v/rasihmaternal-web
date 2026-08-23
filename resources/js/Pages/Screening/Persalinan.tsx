import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
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
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import {
  User,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Info,
  ShieldCheck,
  Heart,
  Baby,
} from "lucide-react";
import { PageProps } from "@/types";

interface PenapisanItem {
  id: string;
  no: number;
  label: string;
}

const PENAPISAN_PERSALINAN_LIST: PenapisanItem[] = [
  { id: "riwayat_bedah_sesar", no: 1, label: "Riwayat bedah sesar" },
  { id: "perdarahan_pervaginam", no: 2, label: "Perdarahan pervaginam" },
  { id: "kehamilan_kurang_bulan", no: 3, label: "Kehamilan kurang bulan" },
  { id: "ketuban_pecah_mekonium", no: 4, label: "Ketuban pecah dengan mekonium kental" },
  { id: "ketuban_pecah_lama", no: 5, label: "Ketuban pecah lama (> 8 jam)" },
  { id: "ketuban_pecah_kurang_bulan", no: 6, label: "Ketuban pecah pada kehamilan kurang bulan" },
  { id: "ikterus", no: 7, label: "Ikterus" },
  { id: "anemi_berat", no: 8, label: "Anemi berat" },
  { id: "preeklamsi_berat", no: 9, label: "Preklamsi berat" },
  { id: "tfu_makrosomi", no: 10, label: "Tinggi fundus uteri > 40 cm (makrosomi)" },
  { id: "demam_tinggi", no: 11, label: "Demam (> 38 °C)" },
  { id: "gawat_janin", no: 12, label: "Gawat janin" },
  { id: "presentasi_bukan_kepala", no: 13, label: "Presentasi bukan belakang kepala" },
  { id: "tali_pusat_menumbung", no: 14, label: "Tali pusat menumbung" },
  { id: "gemeli", no: 15, label: "Gemeli (kehamilan kembar)" },
  { id: "tfu_rendah", no: 16, label: "Kehamilan dengan TFU < 28 cm" },
  { id: "presentasi_majemuk", no: 17, label: "Presentasi Majemuk" },
  { id: "palpasi_kepala_tinggi", no: 18, label: "Primi Para fase aktif palpasi kepala 5/5" },
  { id: "syok", no: 19, label: "Syok" },
];

export default function PersalinanScreening() {
  const { auth } = usePage<PageProps>().props;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [rightPanelView, setRightPanelView] = useState<"summary" | "detail">("summary");

  // State Form Identitas
  const [formData, setFormData] = useState({
    nama_pasien: auth?.user?.name || "",
    nik: auth?.user?.nik || "",
    umur: 27,
    pekerjaan: auth?.user?.pekerjaan || "Ibu Rumah Tangga",
    pendidikan: auth?.user?.pendidikan || "SLTA",
    gravida: 1,
    paritas: 0,
    abortus: 0,
  });

  // State 19 Indikator Penapisan (Default all false / Tidak)
  const [penapisanAnswers, setPenapisanAnswers] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    PENAPISAN_PERSALINAN_LIST.forEach((item) => {
      init[item.id] = false;
    });
    return init;
  });

  const handleTogglePenapisan = (id: string, value: boolean) => {
    setPenapisanAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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

    const errKeys = Object.keys(newErrors);
    if (errKeys.length > 0) {
      setTimeout(() => {
        const firstEl = document.getElementById(errKeys[0]);
        if (firstEl) {
          firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
          firstEl.focus();
        }
      }, 50);
      return false;
    }
    return true;
  };

  const handleNext = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      // Smooth scroll to top of step 2
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    setHasScreened(true);
    setRightPanelView("summary");
  };

  const handleRescreen = () => {
    setHasScreened(false);
    setCurrentStep(1);
    setRightPanelView("summary");
    // Reset Penapisan Answers
    const resetInit: Record<string, boolean> = {};
    PENAPISAN_PERSALINAN_LIST.forEach((item) => {
      resetInit[item.id] = false;
    });
    setPenapisanAnswers(resetInit);
  };

  // Kalkulasi Hasil Penapisan
  const positiveFactors = PENAPISAN_PERSALINAN_LIST.filter(
    (item) => penapisanAnswers[item.id] === true
  );
  const isGawatDarurat = positiveFactors.length > 0;

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
                alt="Penapisan Ibu Bersalin"
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
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5">
                    Penapisan Ibu Bersalin
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                    {hasScreened
                      ? "Hasil evaluasi penapisan gawat darurat & rekomendasi tempat persalinan aman."
                      : "Deteksi kemungkinan komplikasi gawat darurat & penentuan tempat persalinan."}
                  </p>
                </div>

                {/* Dynamic Content Area */}
                {hasScreened ? (
                  rightPanelView === "detail" ? (
                    /* ============================================================ */
                    /* VIEW DETAIL PENAPISAN IBU BERSALIN                           */
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

                      <Card className="border border-slate-200/90 shadow-soft-xs bg-white rounded-3xl p-5 sm:p-6 space-y-4 text-center">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Status Penapisan: <span className="font-semibold text-slate-700">{formData.nama_pasien} ({formData.umur} thn)</span>
                          </p>
                          <h2
                            className={`text-xl sm:text-2xl font-bold tracking-tight mt-1 ${
                              isGawatDarurat ? "text-rose-600" : "text-emerald-700"
                            }`}
                          >
                            {isGawatDarurat
                              ? "Terdeteksi Komplikasi Gawat Darurat"
                              : "Persalinan Fisiologis (Normal & Aman)"}
                          </h2>
                        </div>

                        {/* Status Alert Badge */}
                        <div
                          className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold ${
                            isGawatDarurat
                              ? "bg-rose-50 border-rose-200 text-rose-700"
                              : "bg-emerald-50 border-emerald-200 text-emerald-800"
                          }`}
                        >
                          {isGawatDarurat ? (
                            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          )}
                          <span>
                            {isGawatDarurat
                              ? `${positiveFactors.length} Indikator Kegawatdaruratan Terdeteksi (Wajib Rujuk)`
                              : "Seluruh 19 Indikator Normal (Tidak Ada Gawat Darurat)"}
                          </span>
                        </div>
                      </Card>

                      {/* Cyan Banner Info */}
                      <div className="p-3.5 px-5 rounded-full bg-cyan-50 border border-cyan-100/80 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-cyan-900">
                          <Info className="h-4 w-4 text-cyan-600 shrink-0" />
                          <span className="text-[11px] sm:text-xs">
                            Gunakan hasil penapisan ini untuk rujukan persalinan terencana.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="font-bold text-cyan-700 hover:text-cyan-900 hover:underline shrink-0 text-xs"
                        >
                          Cetak
                        </button>
                      </div>

                      {/* Rincian Seluruh 19 Indikator */}
                      <div className="space-y-2.5 pt-1">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          Rincian 19 Parameter Penapisan:
                        </h4>
                        <div className="space-y-2">
                          {PENAPISAN_PERSALINAN_LIST.map((item) => {
                            const isPositive = penapisanAnswers[item.id] === true;
                            return (
                              <div
                                key={item.id}
                                className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
                                  isPositive
                                    ? "bg-rose-50/50 border-rose-200/90 text-rose-900"
                                    : "bg-white border-slate-200/80 text-slate-700 shadow-soft-xs"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      isPositive
                                        ? "bg-rose-600 text-white"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {item.no}
                                  </span>
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                                    isPositive
                                      ? "bg-rose-600 text-white"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {isPositive ? "YA (Bahaya)" : "TIDAK"}
                                </span>
                              </div>
                            );
                          })}
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
                          <span>Penapisan Ulang</span>
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
                    /* VIEW HASIL RINGKAS PENAPISAN IBU BERSALIN                    */
                    /* ============================================================ */
                    <div className="space-y-5 animate-fadeIn">
                      <Card className="border border-slate-200/90 shadow-soft-xs bg-white rounded-3xl p-5 sm:p-6 space-y-3.5 text-center">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Hasil Penapisan Pasien: <span className="font-semibold text-slate-700">{formData.nama_pasien} ({formData.umur} thn)</span>
                          </p>
                          <h2
                            className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
                              isGawatDarurat ? "text-rose-600" : "text-emerald-700"
                            }`}
                          >
                            {isGawatDarurat
                              ? "Komplikasi Gawat Darurat"
                              : "Persalinan Fisiologis (Normal)"}
                          </h2>
                        </div>

                        {/* Tri-Color Segmented Indicator */}
                        <div className="relative w-full max-w-sm mx-auto pt-2 pb-6">
                          <div className="h-4 w-full rounded-full flex overflow-hidden">
                            <div className="flex-1 bg-[#64B565]" />
                            <div className="flex-1 bg-[#F7D154]" />
                            <div className="flex-1 bg-[#F83838]" />
                          </div>
                          <div
                            className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
                            style={{ left: isGawatDarurat ? "85%" : "15%" }}
                          >
                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
                            <div className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                              {isGawatDarurat ? "Wajib Rujuk" : "Normal"}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs font-semibold text-slate-600">
                          Total Indikator Bahaya:{" "}
                          <strong className={isGawatDarurat ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>
                            {positiveFactors.length} dari 19 Parameter
                          </strong>
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                          <button
                            type="button"
                            onClick={() => setRightPanelView("detail")}
                            className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
                          >
                            Lihat Rincian Penapisan &rarr;
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

                      {/* Card Rekomendasi Tempat & Penolong */}
                      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft-xs space-y-1">
                        <h4 className="font-bold text-rose-700 text-xs sm:text-sm">
                          Rekomendasi Tempat & Penolong Persalinan
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                          {isGawatDarurat
                            ? "Wajib segera dirujuk dan bersalin di Rumah Sakit dengan fasilitas PONEK 24 Jam bersama Dokter Spesialis Kebidanan & Kandungan (Sp.OG)."
                            : "Dianjurkan bersalin di Praktek Mandiri Bidan (PMB) atau Puskesmas PONED bersama Bidan dan Dokter Umum."}
                        </p>
                      </div>

                      {/* Rincian Faktor Bahaya Terdeteksi */}
                      {isGawatDarurat && (
                        <div className="space-y-2.5">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                            Indikator Bahaya yang Terdeteksi:
                          </h4>
                          <div className="space-y-2">
                            {positiveFactors.map((item) => (
                              <div
                                key={item.id}
                                className="p-3.5 rounded-2xl bg-white border border-rose-200/90 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm"
                              >
                                <span className="font-medium text-slate-800">
                                  {item.no}. {item.label}
                                </span>
                                <span className="font-bold text-rose-600 shrink-0">Bahaya</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Saran Terapi Komplementer Persalinan */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs sm:text-sm">
                          <Heart className="h-4 w-4" />
                          <span>Saran Asuhan &amp; Terapi Komplementer Persalinan</span>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-2">
                          <AccordionItem
                            value="terapi-1"
                            className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs"
                          >
                            <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
                              Pijat Punggung (Endorphin Massage) &amp; Relaksasi Napas
                            </AccordionTrigger>
                            <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
                              Membantu mengurangi rasa nyeri kala I fase aktif, memicu pelepasan hormon endorfin alami, dan mempercepat pembukaan serviks secara nyaman.
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem
                            value="terapi-2"
                            className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs"
                          >
                            <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
                              Pijat Oksitosin &amp; Kompres Hangat
                            </AccordionTrigger>
                            <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
                              Memperbaiki efektivitas his / kontraksi rahim secara alami dan memberikan rasa tenang pada ibu bersalin.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  )
                ) : (
                  /* ============================================================ */
                  /* MULTI-STEP FORM PENAPISAN IBU BERSALIN                       */
                  /* ============================================================ */
                  <div className="space-y-5">
                    {/* Progress Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                        <span className={currentStep >= 1 ? "text-emerald-700 font-bold" : ""}>
                          1. Identitas Pasien
                        </span>
                        <span className={currentStep >= 2 ? "text-emerald-700 font-bold" : ""}>
                          2. 19 Indikator Penapisan
                        </span>
                      </div>
                      <Progress value={(currentStep / 2) * 100} variant="default" className="h-2" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Validation Error Alert */}
                      {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="rounded-2xl animate-shake">
                          <AlertTriangle className="h-4 w-4" />
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <AlertTitle>Mohon lengkapi isian wajib:</AlertTitle>
                            <AlertDescription>
                              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                                {Object.entries(errors).map(([key, err]) => (
                                  <li key={key}>{err}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </div>
                        </Alert>
                      )}

                      {/* STEP 1: IDENTITAS PASIEN */}
                      {currentStep === 1 && (
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
                      )}

                      {/* STEP 2: 19 INDIKATOR PENAPISAN IBU BERSALIN */}
                      {currentStep === 2 && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="border-b border-slate-100 pb-2">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <Baby className="h-4 w-4 text-rose-600" />
                              <span>Langkah 2: 19 Indikator Penapisan Gawat Darurat</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5 ml-6">
                              Pilih YA jika kondisi terdeteksi pada ibu bersalin.
                            </p>
                          </div>

                          <div className="space-y-2.5 pt-1">
                            {PENAPISAN_PERSALINAN_LIST.map((item) => {
                              const isPositive = penapisanAnswers[item.id] === true;
                              return (
                                <div
                                  key={item.id}
                                  className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                                    isPositive
                                      ? "bg-rose-50/70 border-rose-300 shadow-soft-xs"
                                      : "bg-white border-slate-200/80 shadow-soft-xs hover:border-slate-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                    <span
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                        isPositive
                                          ? "bg-rose-600 text-white"
                                          : "bg-slate-100 text-slate-700"
                                      }`}
                                    >
                                      {item.no}
                                    </span>
                                    <span
                                      className={`text-xs sm:text-sm leading-snug ${
                                        isPositive
                                          ? "font-bold text-rose-950"
                                          : "font-semibold text-slate-800"
                                      }`}
                                    >
                                      {item.label}
                                    </span>
                                  </div>

                                  {/* Toggle Buttons YA / TIDAK */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePenapisan(item.id, false)}
                                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        !isPositive
                                          ? "bg-slate-800 text-white shadow-soft-xs"
                                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                      }`}
                                    >
                                      Tidak
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePenapisan(item.id, true)}
                                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        isPositive
                                          ? "bg-rose-600 text-white shadow-soft-xs"
                                          : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                                      }`}
                                    >
                                      Ya
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
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
                        ) : (
                          <div />
                        )}

                        {currentStep < 2 ? (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 ml-auto"
                          >
                            <span>Lanjut ke Penapisan</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-8 ml-auto shadow-soft-sm"
                          >
                            <span>Selesai &amp; Lihat Hasil</span>
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
