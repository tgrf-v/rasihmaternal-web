import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { RasihMaternalLayout } from '@/Layouts/RasihMaternalLayout';
import { PartografHeaderData } from '@/types/partograf';
import { PartografCreateModal } from './Components/PartografCreateModal';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Plus,
    Search,
    FileText,
    ChevronRight,
    Clock,
    Calendar,
    Stethoscope,
    AlertCircle,
} from 'lucide-react';

interface PartografIndexProps {
    sessions: PartografHeaderData[];
    filters?: {
        search?: string;
        status?: string;
    };
}

export default function PartografIndex({ sessions = [], filters }: PartografIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'selesai' | 'dirujuk'>(
        (filters?.status as 'all' | 'aktif' | 'selesai' | 'dirujuk') || 'all'
    );
    const [createModalOpen, setCreateModalOpen] = useState(false);

    // Filter lokal real-time
    const filtered = sessions.filter((s) => {
        const matchQuery =
            s.nama_ibu.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.no_register.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.no_puskesmas && s.no_puskesmas.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchQuery && matchStatus;
    });

    return (
        <>
            <Head title="Partograf Digital - Pemantauan Persalinan" />

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                            <Stethoscope className="w-6 h-6 text-emerald-600" />
                            Partograf Digital
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Lembar pemantauan kemajuan persalinan fase aktif (Kala I &amp; II) standar WHO &amp; Kemenkes RI.
                        </p>
                    </div>

                    <Button
                        onClick={() => setCreateModalOpen(true)}
                        className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold gap-2 px-5 shadow-sm self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Mulai Partograf Baru
                    </Button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Cari nama ibu atau no. register..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-full pl-9 text-xs h-9 bg-slate-50"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        {(['all', 'aktif', 'selesai', 'dirujuk'] as const).map((st) => (
                            <button
                                key={st}
                                type="button"
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                    statusFilter === st
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {st === 'all'
                                    ? `Semua (${sessions.length})`
                                    : st === 'aktif'
                                    ? `Persalinan Aktif (${sessions.filter((s) => s.status === 'aktif').length})`
                                    : st === 'selesai'
                                    ? `Selesai (${sessions.filter((s) => s.status === 'selesai').length})`
                                    : `Dirujuk (${sessions.filter((s) => s.status === 'dirujuk').length})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List Kartu Sesi Partograf */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((s) => (
                        <Link
                            key={s.id}
                            href={`/partograf/${s.id}`}
                            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                {/* Status & Register */}
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                        {s.no_register}
                                    </span>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                            s.status === 'aktif'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : s.status === 'dirujuk'
                                                ? 'bg-rose-100 text-rose-800'
                                                : 'bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        {s.status === 'aktif' ? 'Aktif' : s.status === 'dirujuk' ? 'Rujukan' : 'Selesai'}
                                    </span>
                                </div>

                                {/* Pasien Info */}
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                        {s.nama_ibu}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {s.umur_ibu} Tahun • Paritas G{s.gravida} P{s.para} A{s.abortus}
                                    </p>
                                </div>

                                {/* Metadata Waktu */}
                                <div className="bg-slate-50 p-2.5 rounded-xl space-y-1 text-xs text-slate-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{s.tanggal}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Masuk Jam: {s.jam_masuk} WIB</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Action */}
                            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                                <span>Buka Lembar Partograf</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-700">Belum ada data partograf</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Klik tombol "Mulai Partograf Baru" di atas untuk mencatat lembar pemantauan kemajuan persalinan.
                        </p>
                        <Button
                            onClick={() => setCreateModalOpen(true)}
                            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold mt-4 px-5"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Mulai Partograf Baru
                        </Button>
                    </div>
                )}

                {/* Modal Create Session */}
                <PartografCreateModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                />
            </div>
        </>
    );
}

PartografIndex.layout = (page: React.ReactNode) => <RasihMaternalLayout activeNav="persalinan">{page}</RasihMaternalLayout>;
