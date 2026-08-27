import React from 'react';
import { PartografEntryData } from '@/types/partograf';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface PartografHistoryTableProps {
    entries: PartografEntryData[];
    onEdit: (entry: PartografEntryData) => void;
    onDelete: (id: string) => void;
}

export const PartografHistoryTable: React.FC<PartografHistoryTableProps> = ({ entries, onEdit, onDelete }) => {
    const sorted = [...entries].sort((a, b) => a.kolom_idx - b.kolom_idx);

    if (sorted.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                <p className="text-sm font-medium">Belum ada data observasi yang dicatat.</p>
                <p className="text-xs text-slate-400 mt-1">Klik tombol &quot;+ Tambah Observasi&quot; untuk mencatat pemantauan.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Tabel Kronologis Observasi Persalinan</h3>
                <span className="text-xs text-slate-500">{sorted.length} entri tercatat</span>
            </div>
            <div className="overflow-x-auto">
                <Table className="text-xs">
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold text-slate-700">Waktu (Jam Ke-)</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">DJJ</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">Ketuban / Moulage</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">Pembukaan / Turun</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">Kontraksi (10m)</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">TD &amp; Nadi</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">Suhu / Urin</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">Obat / Cairan</TableHead>
                            <TableHead className="font-bold text-slate-700 text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/70">
                                <TableCell className="font-bold text-slate-800 font-mono">
                                    {item.waktu_observasi} <span className="text-slate-400 font-normal">(Jam ke-{item.jam_ke})</span>
                                </TableCell>
                                <TableCell className="text-center font-bold text-blue-700">
                                    {item.djj ? `${item.djj} x/m` : '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-semibold text-slate-700">{item.air_ketuban || '-'}</span> / <span className="text-slate-500">{item.penyusupan || '-'}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-bold text-emerald-700">{item.pembukaan_serviks !== null && item.pembukaan_serviks !== undefined ? `${item.pembukaan_serviks} cm` : '-'}</span> / <span className="text-slate-600">{item.penurunan_kepala !== null && item.penurunan_kepala !== undefined ? `${item.penurunan_kepala}/5` : '-'}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.kontraksi_jumlah ? (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">
                                            {item.kontraksi_jumlah}x ({item.kontraksi_durasi || ''})
                                        </span>
                                    ) : '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.sistol && item.diastol ? `${item.sistol}/${item.diastol}` : '-'} | {item.nadi ? `${item.nadi}x` : '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.suhu ? `${item.suhu}°C` : '-'} | P:{item.urin_protein || '-'} A:{item.urin_aseton || '-'}
                                </TableCell>
                                <TableCell className="text-center text-[11px] text-slate-600">
                                    {item.obat_cairan_iv || (item.oksitosin_tetes ? `Oksi ${item.oksitosin_tetes} tts` : '-')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onEdit(item)}
                                            className="h-7 w-7 p-0 rounded-full text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onDelete(item.id)}
                                            className="h-7 w-7 p-0 rounded-full text-slate-500 hover:text-rose-700 hover:bg-rose-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
