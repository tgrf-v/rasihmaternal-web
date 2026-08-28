import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import {
  Search,
  Phone,
  Mail,
  Trash2,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  LayoutGrid,
  Layers,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Clock,
} from "lucide-react";

interface BidanPreviewData {
  id: number;
  name: string;
  email: string;
  no_str: string;
  puskesmas_wilayah: string;
  no_telepon: string;
  created_at: string;
  status: "Aktif" | "Verifikasi";
}

const mockBidanList: BidanPreviewData[] = [
  {
    id: 1,
    name: "Bidan Siti Rahayu, S.Tr.Keb",
    email: "bidan.siti@puskesmas.go.id",
    no_str: "STR-BDN-2026-0912",
    puskesmas_wilayah: "Puskesmas Kecamatan Cilandak",
    no_telepon: "0812-3456-7890",
    created_at: "14 Agu 2026",
    status: "Aktif",
  },
  {
    id: 2,
    name: "Bidan Nur Azizah, A.Md.Keb",
    email: "nur.azizah@puskesmas.go.id",
    no_str: "STR-BDN-2025-4421",
    puskesmas_wilayah: "Puskesmas Kebayoran Baru",
    no_telepon: "0813-8877-6655",
    created_at: "10 Agu 2026",
    status: "Aktif",
  },
  {
    id: 3,
    name: "Bidan Ratna Dewi, S.Keb., Bdn",
    email: "ratna.dewi@dinkes.go.id",
    no_str: "STR-BDN-2026-1188",
    puskesmas_wilayah: "Puskesmas Pasar Minggu",
    no_telepon: "0819-2233-4455",
    created_at: "02 Agu 2026",
    status: "Aktif",
  },
  {
    id: 4,
    name: "Bidan Indah Permatasari, S.Tr.Keb",
    email: "indah.permata@puskesmas.go.id",
    no_str: "STR-BDN-2026-7890",
    puskesmas_wilayah: "Puskesmas Jagakarsa",
    no_telepon: "0857-1122-3344",
    created_at: "28 Jul 2026",
    status: "Verifikasi",
  },
];

export default function TablePreview() {
  const [activeTab, setActiveTab] = useState<"opt5" | "all" | "opt1" | "opt2" | "opt3" | "opt4">("opt5");
  const [activePillFilter, setActivePillFilter] = useState<string>("semua");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredList = mockBidanList.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.no_str.toLowerCase().includes(q) ||
      b.puskesmas_wilayah.toLowerCase().includes(q);

    if (activePillFilter === "aktif") {
      return matchSearch && b.status === "Aktif";
    }
    if (activePillFilter === "verifikasi") {
      return matchSearch && b.status === "Verifikasi";
    }
    return matchSearch;
  });

  return (
    <BundaSehatLayout activeNav="admin-bidan">
      <Head title="Preview Desain Tabel Minimalis - RASIH Maternal" />

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
        
        {/* TOP BAR / NAVIGATION BACK */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href={route("admin.bidan.index")}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke Kelola Bidan</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Galeri Opsi Desain Tabel Minimalis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilih gaya tabel yang paling sesuai dengan preferensi estetika antarmuka RASIH Maternal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={route("admin.bidan.index")}>
              <Button variant="outline" size="sm" className="rounded-full text-xs font-bold gap-1.5">
                <span>Halaman Admin Utama</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </Button>
            </Link>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-2 sm:p-2.5 rounded-3xl border border-slate-200/70">
          
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("opt5")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "opt5"
                  ? "bg-emerald-700 text-white shadow-soft-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Opsi 5: Pure White Card (Sesuai Style Gambar)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === "all"
                  ? "bg-emerald-700 text-white shadow-soft-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Semua (Bandingkan)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("opt1")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === "opt1"
                  ? "bg-emerald-700 text-white shadow-soft-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Opsi 1: Linear
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("opt2")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === "opt2"
                  ? "bg-emerald-700 text-white shadow-soft-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Opsi 2: Floating Cards
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("opt3")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === "opt3"
                  ? "bg-emerald-700 text-white shadow-soft-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Opsi 3: Framed
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("opt4")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === "opt4"
                  ? "bg-emerald-700 text-white shadow-soft-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Opsi 4: Zebra Soft
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari simulasi data..."
              className="pl-9 text-xs h-9 rounded-full border border-slate-200 bg-white shadow-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPSI 5: PURE WHITE MINIMALIST CARD (STYLE GAMBAR REFERENSI) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(activeTab === "all" || activeTab === "opt5") && (
          <section className="space-y-4 pt-2">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Opsi 5
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Pure White Minimalist Card (Style Sesuai Gambar)
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Card putih polos, transparent header, baris bersih lapang
              </span>
            </div>

            {/* THE PURE WHITE CARD TABLE CONTAINER */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Card Header: Title & Search Input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Daftar Bidan
                </h2>

                <div className="relative w-full sm:w-64">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari bidan, STR, faskes..."
                    className="pl-9 text-xs h-9 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Table Data: Clean White Minimalist Rows with Transparent Header */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100/60">
                      <th className="pb-4 pr-6 font-semibold">Nama Bidan</th>
                      <th className="pb-4 px-6 font-semibold">No. STR</th>
                      <th className="pb-4 px-6 font-semibold">Wilayah Puskesmas</th>
                      <th className="pb-4 px-6 font-semibold">No. WhatsApp</th>
                      <th className="pb-4 px-6 font-semibold">Terdaftar</th>
                      <th className="pb-4 pl-6 text-right font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {filteredList.map((bidan) => (
                      <tr key={`opt5-${bidan.id}`} className="group hover:bg-slate-50/50 transition-colors">
                        
                        {/* 1. Nama Bidan & Email */}
                        <td className="py-4 pr-6">
                          <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100/60">
                              {bidan.name.charAt(6)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-snug">
                                {bidan.name}
                              </p>
                              <p className="text-xs text-slate-400 font-normal mt-0.5">
                                {bidan.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 2. No. STR */}
                        <td className="py-4 px-6">
                          <span className="text-xs font-mono font-semibold text-slate-700">
                            {bidan.no_str}
                          </span>
                        </td>

                        {/* 3. Wilayah Puskesmas */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{bidan.puskesmas_wilayah}</span>
                          </div>
                        </td>

                        {/* 4. No. WhatsApp */}
                        <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{bidan.no_telepon}</span>
                          </div>
                        </td>

                        {/* 5. Terdaftar */}
                        <td className="py-4 px-6 text-xs text-slate-400">
                          {bidan.created_at}
                        </td>

                        {/* 6. Aksi */}
                        <td className="py-4 pl-6 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-auto"
                            title="Hapus Akun Bidan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPSI 1: LINEAR / VERCEL ULTRA-MINIMALIST */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(activeTab === "all" || activeTab === "opt1") && (
          <section className="space-y-4 pt-4 border-t border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Opsi 1
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Linear / Vercel Ultra-Minimalist
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menyatu langsung dengan latar halaman, tanpa bingkai tebal, pemisah garis halus 1px, tombol aksi muncul lembut saat hover baris.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {filteredList.length} data
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4 font-semibold">Nama Bidan</th>
                    <th className="pb-3 px-4 font-semibold">No. STR</th>
                    <th className="pb-3 px-4 font-semibold">Wilayah Puskesmas</th>
                    <th className="pb-3 px-4 font-semibold">WhatsApp</th>
                    <th className="pb-3 px-4 font-semibold">Terdaftar</th>
                    <th className="pb-3 pl-4 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map((bidan) => (
                    <tr
                      key={`opt1-${bidan.id}`}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors shrink-0">
                            {bidan.name.charAt(6)}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {bidan.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-normal">
                              {bidan.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {bidan.no_str}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{bidan.puskesmas_wilayah}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {bidan.no_telepon}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {bidan.created_at}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-slate-300 group-hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPSI 2: FLOATING ROW CARDS (STRIPE / SUPABASE STYLE) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(activeTab === "all" || activeTab === "opt2") && (
          <section className="space-y-4 pt-4 border-t border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Opsi 2
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Floating Row Cards (Card-Row Hybrid)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap baris adalah kartu melayang independen, tidak monoton seperti spreadsheet tradisional, sangat elegan & modern.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {filteredList.length} data
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredList.map((bidan) => (
                <div
                  key={`opt2-${bidan.id}`}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-emerald-300 hover:shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-[240px]">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-800 font-bold text-sm flex items-center justify-center border border-emerald-100 shrink-0">
                      {bidan.name.charAt(6)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {bidan.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{bidan.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        No. STR
                      </span>
                      <span className="font-mono font-semibold text-slate-700">
                        {bidan.no_str}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Wilayah Puskesmas
                      </span>
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{bidan.puskesmas_wilayah}</span>
                      </span>
                    </div>

                    <div className="hidden md:block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Terdaftar
                      </span>
                      <span className="text-slate-500 font-medium">
                        {bidan.created_at}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                      title="Hapus Bidan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPSI 3: SLEEK FRAMED MINIMALIST */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(activeTab === "all" || activeTab === "opt3") && (
          <section className="space-y-4 pt-4 border-t border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    Opsi 3
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Sleek Framed Minimalist (Notion / Linear Table)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bingkai rounded halus, header abu-abu sangat lembut, titik indikator status aktif hijau, tipografi rapi berjenjang.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {filteredList.length} data
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-soft-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b border-slate-200/70">
                    <TableHead className="text-xs font-semibold text-slate-500 pl-5">Nama Bidan</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">No. STR</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Wilayah Puskesmas</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Terdaftar</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 text-right pr-5">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredList.map((bidan) => (
                    <TableRow key={`opt3-${bidan.id}`} className="hover:bg-slate-50/60 border-b border-slate-100">
                      <TableCell className="pl-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {bidan.name.charAt(6)}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-900">
                              {bidan.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {bidan.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant="outline" className="text-[11px] font-mono bg-slate-50 border-slate-200 text-slate-700">
                          {bidan.no_str}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{bidan.puskesmas_wilayah}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>{bidan.status}</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs text-slate-500">
                        {bidan.created_at}
                      </TableCell>
                      <TableCell className="py-3.5 text-right pr-5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPSI 4: BORDERLESS ZEBRA SOFT */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(activeTab === "all" || activeTab === "opt4") && (
          <section className="space-y-4 pt-4 border-t border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    Opsi 4
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Borderless Zebra Soft (Clean Healthcare)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bebas dari garis kotak pembatas, menggunakan warna latar selang-seling yang sangat lembut dengan sudut rounded di setiap baris.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {filteredList.length} data
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm border-separate border-spacing-y-1.5">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-4 pb-2 font-semibold">Nama Bidan</th>
                    <th className="px-4 pb-2 font-semibold">No. STR</th>
                    <th className="px-4 pb-2 font-semibold">Puskesmas</th>
                    <th className="px-4 pb-2 font-semibold">WhatsApp</th>
                    <th className="px-4 pb-2 font-semibold">Terdaftar</th>
                    <th className="px-4 pb-2 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((bidan, idx) => (
                    <tr
                      key={`opt4-${bidan.id}`}
                      className={`transition-colors hover:bg-emerald-50/50 ${
                        idx % 2 === 0 ? "bg-slate-50/70" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4 rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white shadow-soft-xs text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {bidan.name.charAt(6)}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-900">
                              {bidan.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {bidan.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-semibold text-slate-700">
                        {bidan.no_str}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 font-medium">
                        {bidan.puskesmas_wilayah}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {bidan.no_telepon}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {bidan.created_at}
                      </td>
                      <td className="py-3 px-4 text-right rounded-r-2xl">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    </BundaSehatLayout>
  );
}
