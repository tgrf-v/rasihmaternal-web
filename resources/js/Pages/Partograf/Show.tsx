import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { BundaSehatLayout } from '@/Layouts/BundaSehatLayout';
import { PartografHeaderData, PartografEntryData } from '@/types/partograf';
import { PartografHeaderInfo } from './Components/PartografHeaderInfo';
import { PartografChartSheet } from './Components/PartografChartSheet';
import { PartografEntryDialog } from './Components/PartografEntryDialog';
import { PartografHistoryTable } from './Components/PartografHistoryTable';
import { Button } from '@/Components/ui/button';
import {
    Plus,
    Printer,
    Table as TableIcon,
    BarChart3,
    ArrowLeft,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';

// Data Mock Awal Realistis (Persalinan Aktif)
const INITIAL_HEADER: PartografHeaderData = {
    id: 'session-001',
    no_register: 'REG-2026-0819',
    no_puskesmas: 'PKM-SEHAT-01',
    nama_ibu: 'Ny. Siti Nurhaliza',
    umur_ibu: 27,
    gravida: 2,
    para: 1,
    abortus: 0,
    tanggal: '26 Agustus 2026',
    jam_masuk: '08:00',
    ketuban_pecah_sejak: '07:30 WIB',
    mules_sejak: '03:00 WIB',
    status: 'aktif',
};

const INITIAL_ENTRIES: PartografEntryData[] = [
    {
        id: 'e-1',
        partograf_session_id: 'session-001',
        waktu_observasi: '08:00',
        jam_ke: 1,
        kolom_idx: 0,
        djj: 140,
        air_ketuban: 'U',
        penyusupan: '0',
        pembukaan_serviks: 4,
        penurunan_kepala: 4,
        kontraksi_jumlah: 2,
        kontraksi_durasi: '<20',
        nadi: 80,
        sistol: 120,
        diastol: 80,
        suhu: 36.6,
        urin_protein: '-',
        urin_aseton: '-',
        urin_volume: 150,
    },
    {
        id: 'e-2',
        partograf_session_id: 'session-001',
        waktu_observasi: '08:30',
        jam_ke: 1,
        kolom_idx: 1,
        djj: 144,
        kontraksi_jumlah: 2,
        kontraksi_durasi: '20-40',
        nadi: 82,
    },
    {
        id: 'e-3',
        partograf_session_id: 'session-001',
        waktu_observasi: '09:00',
        jam_ke: 2,
        kolom_idx: 2,
        djj: 138,
        air_ketuban: 'J',
        penyusupan: '0',
        kontraksi_jumlah: 3,
        kontraksi_durasi: '20-40',
        nadi: 84,
    },
    {
        id: 'e-4',
        partograf_session_id: 'session-001',
        waktu_observasi: '09:30',
        jam_ke: 2,
        kolom_idx: 3,
        djj: 142,
        kontraksi_jumlah: 3,
        kontraksi_durasi: '20-40',
        nadi: 80,
    },
    {
        id: 'e-5',
        partograf_session_id: 'session-001',
        waktu_observasi: '10:00',
        jam_ke: 3,
        kolom_idx: 4,
        djj: 136,
        air_ketuban: 'J',
        penyusupan: '1',
        kontraksi_jumlah: 3,
        kontraksi_durasi: '20-40',
        nadi: 86,
        sistol: 120,
        diastol: 80,
        suhu: 36.8,
    },
    {
        id: 'e-6',
        partograf_session_id: 'session-001',
        waktu_observasi: '10:30',
        jam_ke: 3,
        kolom_idx: 5,
        djj: 140,
        kontraksi_jumlah: 4,
        kontraksi_durasi: '20-40',
        nadi: 84,
    },
    {
        id: 'e-7',
        partograf_session_id: 'session-001',
        waktu_observasi: '11:00',
        jam_ke: 4,
        kolom_idx: 6,
        djj: 144,
        air_ketuban: 'J',
        penyusupan: '1',
        kontraksi_jumlah: 4,
        kontraksi_durasi: '>40',
        nadi: 88,
    },
    {
        id: 'e-8',
        partograf_session_id: 'session-001',
        waktu_observasi: '11:30',
        jam_ke: 4,
        kolom_idx: 7,
        djj: 140,
        kontraksi_jumlah: 4,
        kontraksi_durasi: '>40',
        nadi: 86,
    },
    {
        id: 'e-9',
        partograf_session_id: 'session-001',
        waktu_observasi: '12:00',
        jam_ke: 5,
        kolom_idx: 8,
        djj: 138,
        air_ketuban: 'J',
        penyusupan: '1',
        pembukaan_serviks: 7.5,
        penurunan_kepala: 2,
        kontraksi_jumlah: 4,
        kontraksi_durasi: '>40',
        nadi: 88,
        sistol: 125,
        diastol: 80,
        suhu: 36.7,
        urin_protein: '-',
        urin_aseton: '-',
        urin_volume: 120,
    },
];

export default function PartografShow() {
    const [header] = useState<PartografHeaderData>(INITIAL_HEADER);
    const [entries, setEntries] = useState<PartografEntryData[]>(INITIAL_ENTRIES);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedEntry, setSelectedEntry] = useState<PartografEntryData | null>(null);
    const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

    // Next Kolom Index
    const lastKolomIdx = entries.length > 0 ? Math.max(...entries.map((e) => e.kolom_idx)) : -1;
    const nextKolomIdx = Math.min(31, lastKolomIdx + 1);

    const handleSaveEntry = (newEntry: PartografEntryData) => {
        setEntries((prev) => {
            const exists = prev.some((e) => e.id === newEntry.id || e.kolom_idx === newEntry.kolom_idx);
            if (exists) {
                return prev.map((e) => (e.id === newEntry.id || e.kolom_idx === newEntry.kolom_idx ? newEntry : e));
            }
            return [...prev, newEntry];
        });
        setSelectedEntry(null);
    };

    const handleDeleteEntry = (id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    const handleEditEntry = (entry: PartografEntryData) => {
        setSelectedEntry(entry);
        setDialogOpen(true);
    };

    const handleAddNewClick = () => {
        setSelectedEntry(null);
        setDialogOpen(true);
    };

    // Evaluasi Status Klinis
    const latestCervixEntry = [...entries].reverse().find((e) => e.pembukaan_serviks !== null && e.pembukaan_serviks !== undefined);
    const latestDjjEntry = [...entries].reverse().find((e) => e.djj !== null && e.djj !== undefined);

    const isDjjSafe = latestDjjEntry?.djj ? latestDjjEntry.djj >= 120 && latestDjjEntry.djj <= 160 : true;

    return (
        <BundaSehatLayout activeNav="persalinan">
            <Head title={`Partograf - ${header.nama_ibu}`} />

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
                {/* Navigation Bar / Breadcrumb */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/partograf"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Partograf
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Toggle View Mode */}
                        <div className="bg-white border border-slate-200 rounded-full p-0.5 flex items-center shadow-xs">
                            <button
                                type="button"
                                onClick={() => setViewMode('chart')}
                                className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all ${
                                    viewMode === 'chart'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                Grafik Partograf
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <TableIcon className="w-3.5 h-3.5" />
                                Tabel Data
                            </button>
                        </div>

                        {/* Print Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            className="rounded-full text-xs gap-1.5 hidden sm:inline-flex bg-white"
                        >
                            <Printer className="w-3.5 h-3.5 text-slate-600" />
                            Cetak
                        </Button>

                        {/* Add Entry Button */}
                        <Button
                            onClick={handleAddNewClick}
                            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            + Tambah Observasi
                        </Button>
                    </div>
                </div>

                {/* Header Information Pasien */}
                <PartografHeaderInfo header={header} />

                {/* Alert & Clinical Indicator Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                            <div className="font-bold text-emerald-900">Kurva Pembukaan Sesuai Jalur</div>
                            <p className="text-emerald-700 mt-0.5">
                                Pembukaan saat ini {latestCervixEntry?.pembukaan_serviks || 4} cm berada di sebelah kiri garis waspada. Kemajuan persalinan normal.
                            </p>
                        </div>
                    </div>

                    <div className={`border rounded-2xl p-3.5 flex items-start gap-3 ${
                        isDjjSafe ? 'bg-blue-50/80 border-blue-200/80' : 'bg-rose-50/80 border-rose-200/80'
                    }`}>
                        {isDjjSafe ? (
                            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="text-xs">
                            <div className={`font-bold ${isDjjSafe ? 'text-blue-900' : 'text-rose-900'}`}>
                                DJJ: {latestDjjEntry?.djj || 140} x/menit ({isDjjSafe ? 'Normal' : 'Abnormal'})
                            </div>
                            <p className={`mt-0.5 ${isDjjSafe ? 'text-blue-700' : 'text-rose-700'}`}>
                                Rentang aman standar WHO: 120 – 160 x/menit.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                        <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                            <div className="font-bold text-slate-900">Petunjuk Pengisian Digital</div>
                            <p className="text-slate-600 mt-0.5">
                                Klik langsung pada titik grafik atau tombol observasi untuk mengupdate data berkala.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content: Chart Sheet vs Table */}
                {viewMode === 'chart' ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-800">Visualisasi Lembar Partograf WHO / Kemenkes RI</h3>
                            <span className="text-xs text-slate-400">Total 16 Jam Pemantauan (Interval 30 Menit)</span>
                        </div>
                        <PartografChartSheet entries={entries} onSelectEntry={handleEditEntry} />
                    </div>
                ) : (
                    <PartografHistoryTable entries={entries} onEdit={handleEditEntry} onDelete={handleDeleteEntry} />
                )}

                {/* Modal Entry Observasi */}
                <PartografEntryDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSave={handleSaveEntry}
                    existingEntry={selectedEntry}
                    defaultKolomIdx={nextKolomIdx}
                />
            </div>
        </BundaSehatLayout>
    );
}
