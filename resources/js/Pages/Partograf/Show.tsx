import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BundaSehatLayout } from '@/Layouts/BundaSehatLayout';
import { PartografHeaderData, PartografEntryData } from '@/types/partograf';
import { PartografHeaderInfo } from './Components/PartografHeaderInfo';
import { PartografChartSheet } from './Components/PartografChartSheet';
import { PartografEntryDialog } from './Components/PartografEntryDialog';
import { PartografHistoryTable } from './Components/PartografHistoryTable';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Plus,
    Printer,
    Table as TableIcon,
    BarChart3,
    ArrowLeft,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
    Check,
    Send,
    ChevronDown,
} from 'lucide-react';

interface PartografShowProps {
    id: string;
    session: PartografHeaderData;
    entries: PartografEntryData[];
}

export default function PartografShow({ id, session, entries = [] }: PartografShowProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedEntry, setSelectedEntry] = useState<PartografEntryData | null>(null);
    const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
    const [statusModalOpen, setStatusModalOpen] = useState(false);

    // Next Kolom Index (0 s/d 31)
    const lastKolomIdx = entries.length > 0 ? Math.max(...entries.map((e) => e.kolom_idx)) : -1;
    const nextKolomIdx = Math.min(31, lastKolomIdx + 1);

    const handleSaveEntry = (newEntry: PartografEntryData) => {
        router.post(
            `/partograf/${session.id}/entries`,
            {
                ...newEntry,
                partograf_session_id: session.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDialogOpen(false);
                    setSelectedEntry(null);
                },
            }
        );
    };

    const handleDeleteEntry = (entryId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan observasi ini?')) {
            router.delete(`/partograf/${session.id}/entries/${entryId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleStatusChange = (newStatus: 'aktif' | 'selesai' | 'dirujuk') => {
        const catatanPrompt = prompt(
            `Ubah status menjadi "${newStatus}". Tambahkan catatan jika ada (opsional):`,
            session.catatan || ''
        );
        if (catatanPrompt !== null) {
            router.put(
                `/partograf/${session.id}/status`,
                {
                    status: newStatus,
                    catatan: catatanPrompt,
                },
                {
                    preserveScroll: true,
                }
            );
        }
    };

    const handleEditEntry = (entry: PartografEntryData) => {
        setSelectedEntry(entry);
        setDialogOpen(true);
    };

    const handleAddNewClick = () => {
        setSelectedEntry(null);
        setDialogOpen(true);
    };

    // Evaluasi Status Klinis Terakhir
    const latestCervixEntry = [...entries]
        .reverse()
        .find((e) => e.pembukaan_serviks !== null && e.pembukaan_serviks !== undefined);
    const latestDjjEntry = [...entries]
        .reverse()
        .find((e) => e.djj !== null && e.djj !== undefined);

    const isDjjSafe = latestDjjEntry?.djj ? latestDjjEntry.djj >= 120 && latestDjjEntry.djj <= 160 : true;

    return (
        <BundaSehatLayout activeNav="persalinan">
            <Head title={`Partograf - ${session.nama_ibu}`} />

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
                {/* Navigation Bar / Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link
                        href="/partograf"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Partograf
                    </Link>

                    <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
                        {/* Status Change Buttons */}
                        {session.status === 'aktif' && (
                            <>
                                {/* Desktop Buttons (sm and up) */}
                                <div className="hidden sm:flex items-center gap-1.5 mr-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusChange('selesai')}
                                        className="rounded-full text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 h-8"
                                    >
                                        <Check className="w-3.5 h-3.5 mr-1" />
                                        Selesai Partus
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusChange('dirujuk')}
                                        className="rounded-full text-xs text-rose-700 border-rose-300 hover:bg-rose-50 h-8"
                                    >
                                        <Send className="w-3.5 h-3.5 mr-1" />
                                        Rujuk RS
                                    </Button>
                                </div>

                                {/* Mobile Dropdown (sm:hidden) */}
                                <div className="sm:hidden">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full text-xs h-8 px-2.5 gap-1 text-slate-700 border-slate-300 bg-white"
                                            >
                                                <span>Aksi Status</span>
                                                <ChevronDown className="w-3 h-3 text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-40 text-xs">
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange('selesai')}
                                                className="text-emerald-700 font-semibold cursor-pointer gap-2 py-2"
                                            >
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                Selesai Partus
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange('dirujuk')}
                                                className="text-rose-700 font-semibold cursor-pointer gap-2 py-2"
                                            >
                                                <Send className="w-3.5 h-3.5 text-rose-600" />
                                                Rujuk RS
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </>
                        )}

                        {/* Toggle View Mode */}
                        <div className="bg-slate-100/90 border border-slate-200/80 rounded-full p-0.5 flex items-center shadow-xs">
                            <button
                                type="button"
                                onClick={() => setViewMode('chart')}
                                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all ${
                                    viewMode === 'chart'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Grafik Partograf</span>
                                <span className="sm:hidden">Grafik</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <TableIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Tabel Data ({entries.length})</span>
                                <span className="sm:hidden">Tabel</span>
                            </button>
                        </div>

                        {/* Print Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            className="rounded-full text-xs gap-1.5 hidden sm:inline-flex bg-white h-8"
                        >
                            <Printer className="w-3.5 h-3.5 text-slate-600" />
                            Cetak
                        </Button>

                        {/* Add Entry Button */}
                        <Button
                            onClick={handleAddNewClick}
                            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 shadow-xs h-8 px-3.5 sm:px-4"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Tambah Observasi</span>
                            <span className="sm:hidden">Observasi</span>
                        </Button>
                    </div>
                </div>

                {/* Header Information Pasien */}
                <PartografHeaderInfo header={session} />

                {/* Alert & Clinical Indicator Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col items-center justify-center text-center">
                        <div className="text-xs">
                            <div className="font-bold text-slate-900">Kurva Kemajuan Persalinan</div>
                            <p className="text-slate-500 mt-0.5">
                                Pembukaan serviks terakhir: {latestCervixEntry?.pembukaan_serviks ? `${latestCervixEntry.pembukaan_serviks} cm` : 'Belum dicatat'}.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col items-center justify-center text-center">
                        <div className="text-xs">
                            <div className="font-bold text-slate-900">
                                DJJ: {latestDjjEntry?.djj ? `${latestDjjEntry.djj} x/menit` : 'Belum ada data'} ({isDjjSafe ? 'Normal' : 'Abnormal'})
                            </div>
                            <p className="text-slate-500 mt-0.5">
                                Rentang normal DJJ WHO: 120 – 160 x/menit.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs sm:col-span-2 lg:col-span-1 flex flex-col items-center justify-center text-center">
                        <div className="text-xs">
                            <div className="font-bold text-slate-900">Petunjuk Pengisian Digital</div>
                            <p className="text-slate-500 mt-0.5">
                                Klik langsung pada titik kolom grafik atau tombol "Tambah Observasi" untuk mencatat data berkala.
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
