import React from 'react';
import { PartografHeaderData } from '@/types/partograf';
import { User, Calendar, Clock, Activity, FileText } from 'lucide-react';

interface PartografHeaderInfoProps {
    header: PartografHeaderData;
}

export const PartografHeaderInfo: React.FC<PartografHeaderInfoProps> = ({ header }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 text-slate-800">
            {/* Top Row: Title & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Lembar Partograf Pemantauan Persalinan</h2>
                        <p className="text-xs text-slate-500">Standar Pemantauan Kala I &amp; II Fase Aktif</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                        header.status === 'aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : header.status === 'dirujuk'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                    }`}>
                        {header.status === 'aktif' ? 'Persalinan Aktif' : header.status === 'dirujuk' ? 'Rujukan' : 'Selesai'}
                    </span>
                </div>
            </div>

            {/* Grid Data Pasien */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 font-medium text-[11px] mb-0.5">No. Register</div>
                    <div className="font-bold text-slate-800 font-mono">{header.no_register || '-'}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 font-medium text-[11px] mb-0.5">Nama Ibu / Umur</div>
                    <div className="font-bold text-slate-800">{header.nama_ibu} ({header.umur_ibu} th)</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 font-medium text-[11px] mb-0.5">Paritas (G / P / A)</div>
                    <div className="font-bold text-slate-800 font-mono">
                        G{header.gravida} P{header.para} A{header.abortus}
                    </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 font-medium text-[11px] mb-0.5">Tanggal &amp; Jam Masuk</div>
                    <div className="font-bold text-slate-800">{header.tanggal} • {header.jam_masuk}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 font-medium text-[11px] mb-0.5">Ketuban Pecah Sejak</div>
                    <div className="font-bold text-slate-800">{header.ketuban_pecah_sejak || 'Belum pecah'}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 font-medium text-[11px] mb-0.5">Mules Sejak Jam</div>
                    <div className="font-bold text-slate-800">{header.mules_sejak || '-'}</div>
                </div>
            </div>
        </div>
    );
};
