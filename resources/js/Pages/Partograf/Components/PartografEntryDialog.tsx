import React, { useState, useEffect } from 'react';
import { PartografEntryData, AirKetubanType, PenyusupanType, KontraksiDurasiType } from '@/types/partograf';
import { Dialog } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Activity, Baby, Heart } from 'lucide-react';

interface PartografEntryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (entry: PartografEntryData) => void;
    existingEntry?: PartografEntryData | null;
    defaultKolomIdx?: number;
}

export const PartografEntryDialog: React.FC<PartografEntryDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    existingEntry,
    defaultKolomIdx = 0,
}) => {
    const [kolomIdx, setKolomIdx] = useState<number>(defaultKolomIdx);
    const [waktu, setWaktu] = useState<string>('08:00');
    const [djj, setDjj] = useState<string>('');
    const [airKetuban, setAirKetuban] = useState<AirKetubanType | ''>('');
    const [penyusupan, setPenyusupan] = useState<PenyusupanType | ''>('');
    const [pembukaan, setPembukaan] = useState<string>('');
    const [turunKepala, setTurunKepala] = useState<string>('');
    const [kontraksiJml, setKontraksiJml] = useState<string>('');
    const [kontraksiDur, setKontraksiDur] = useState<KontraksiDurasiType | ''>('');
    const [oksitosinUnit, setOksitosinUnit] = useState<string>('');
    const [oksitosinTetes, setOksitosinTetes] = useState<string>('');
    const [obatCairan, setObatCairan] = useState<string>('');
    const [nadi, setNadi] = useState<string>('');
    const [sistol, setSistol] = useState<string>('');
    const [diastol, setDiastol] = useState<string>('');
    const [suhu, setSuhu] = useState<string>('');
    const [urinProtein, setUrinProtein] = useState<string>('');
    const [urinAseton, setUrinAseton] = useState<string>('');
    const [urinVolume, setUrinVolume] = useState<string>('');

    useEffect(() => {
        if (existingEntry) {
            setKolomIdx(existingEntry.kolom_idx);
            setWaktu(existingEntry.waktu_observasi);
            setDjj(existingEntry.djj ? String(existingEntry.djj) : '');
            setAirKetuban(existingEntry.air_ketuban || '');
            setPenyusupan(existingEntry.penyusupan || '');
            setPembukaan(existingEntry.pembukaan_serviks !== null && existingEntry.pembukaan_serviks !== undefined ? String(existingEntry.pembukaan_serviks) : '');
            setTurunKepala(existingEntry.penurunan_kepala !== null && existingEntry.penurunan_kepala !== undefined ? String(existingEntry.penurunan_kepala) : '');
            setKontraksiJml(existingEntry.kontraksi_jumlah ? String(existingEntry.kontraksi_jumlah) : '');
            setKontraksiDur(existingEntry.kontraksi_durasi || '');
            setOksitosinUnit(existingEntry.oksitosin_unit || '');
            setOksitosinTetes(existingEntry.oksitosin_tetes ? String(existingEntry.oksitosin_tetes) : '');
            setObatCairan(existingEntry.obat_cairan_iv || '');
            setNadi(existingEntry.nadi ? String(existingEntry.nadi) : '');
            setSistol(existingEntry.sistol ? String(existingEntry.sistol) : '');
            setDiastol(existingEntry.diastol ? String(existingEntry.diastol) : '');
            setSuhu(existingEntry.suhu ? String(existingEntry.suhu) : '');
            setUrinProtein(existingEntry.urin_protein || '');
            setUrinAseton(existingEntry.urin_aseton || '');
            setUrinVolume(existingEntry.urin_volume ? String(existingEntry.urin_volume) : '');
        } else {
            setKolomIdx(defaultKolomIdx);
            const hour = Math.floor(defaultKolomIdx / 2) + 8;
            const min = defaultKolomIdx % 2 === 0 ? '00' : '30';
            setWaktu(`${String(hour).padStart(2, '0')}:${min}`);
            setDjj('');
            setAirKetuban('');
            setPenyusupan('');
            setPembukaan('');
            setTurunKepala('');
            setKontraksiJml('');
            setKontraksiDur('');
            setOksitosinUnit('');
            setOksitosinTetes('');
            setObatCairan('');
            setNadi('');
            setSistol('');
            setDiastol('');
            setSuhu('');
            setUrinProtein('');
            setUrinAseton('');
            setUrinVolume('');
        }
    }, [existingEntry, defaultKolomIdx, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const entry: PartografEntryData = {
            id: existingEntry ? existingEntry.id : `entry-${Date.now()}`,
            partograf_session_id: 'session-1',
            waktu_observasi: waktu,
            jam_ke: Math.floor(kolomIdx / 2) + 1,
            kolom_idx: kolomIdx,
            djj: djj ? Number(djj) : null,
            air_ketuban: (airKetuban as AirKetubanType) || null,
            penyusupan: (penyusupan as PenyusupanType) || null,
            pembukaan_serviks: pembukaan ? Number(pembukaan) : null,
            penurunan_kepala: turunKepala ? Number(turunKepala) : null,
            kontraksi_jumlah: kontraksiJml ? Number(kontraksiJml) : null,
            kontraksi_durasi: (kontraksiDur as KontraksiDurasiType) || null,
            oksitosin_unit: oksitosinUnit || null,
            oksitosin_tetes: oksitosinTetes ? Number(oksitosinTetes) : null,
            obat_cairan_iv: obatCairan || null,
            nadi: nadi ? Number(nadi) : null,
            sistol: sistol ? Number(sistol) : null,
            diastol: diastol ? Number(diastol) : null,
            suhu: suhu ? Number(suhu) : null,
            urin_protein: urinProtein || null,
            urin_aseton: urinAseton || null,
            urin_volume: urinVolume ? Number(urinVolume) : null,
        };
        onSave(entry);
        onOpenChange(false);
    };

    const jamKeDisplay = Math.floor(kolomIdx / 2) + 1;
    const menitKeDisplay = kolomIdx % 2 === 0 ? '00' : '30';

    return (
        <Dialog
            isOpen={open}
            onClose={() => onOpenChange(false)}
            title={existingEntry ? 'Edit Observasi Partograf' : 'Tambah Observasi Partograf'}
            description="Masukkan data berkala kondisi janin, kemajuan, kontraksi, dan tanda vital ibu"
            className="max-w-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {/* Waktu Observasi & Kolom */}
                <div className="bg-slate-50 p-3.5 rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Posisi Jam Ke-</Label>
                        <Select value={String(kolomIdx)} onValueChange={(val: string) => setKolomIdx(Number(val))}>
                            <SelectTrigger className="rounded-full mt-1 bg-white text-xs h-9">
                                <SelectValue placeholder="Pilih Waktu" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                                {Array.from({ length: 32 }).map((_, idx) => {
                                    const h = Math.floor(idx / 2) + 1;
                                    const m = idx % 2 === 0 ? '00' : '30';
                                    return (
                                        <SelectItem key={idx} value={String(idx)} className="text-xs">
                                            Jam ke-{h} (menit :{m})
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Jam Aktual (WIB)</Label>
                        <Input
                            type="time"
                            value={waktu}
                            onChange={(e) => setWaktu(e.target.value)}
                            className="rounded-full mt-1 bg-white text-xs h-9"
                            required
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex flex-col justify-center">
                        <span className="text-[11px] text-slate-400">Status Kolom Waktu:</span>
                        <span className="text-xs font-bold text-emerald-700">Jam ke-{jamKeDisplay} +{menitKeDisplay}m</span>
                    </div>
                </div>

                {/* Section 1: Janin */}
                <div className="border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Baby className="w-4 h-4 text-blue-600" />
                        Kondisi Janin
                    </h4>
                    <div className="grid grid-cols-3 gap-2.5">
                        <div>
                            <Label className="text-[11px] text-slate-600">DJJ (/menit)</Label>
                            <Input
                                type="number"
                                min="80"
                                max="200"
                                placeholder="120-160"
                                value={djj}
                                onChange={(e) => setDjj(e.target.value)}
                                className="rounded-full mt-1 text-xs h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">Air Ketuban</Label>
                            <Select value={airKetuban} onValueChange={(val: string) => setAirKetuban(val as AirKetubanType)}>
                                <SelectTrigger className="rounded-full mt-1 text-xs h-9">
                                    <SelectValue placeholder="Pilih..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="U">U (Utuh)</SelectItem>
                                    <SelectItem value="J">J (Jernih)</SelectItem>
                                    <SelectItem value="M">M (Mekonium)</SelectItem>
                                    <SelectItem value="D">D (Darah)</SelectItem>
                                    <SelectItem value="K">K (Kering)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">Penyusupan</Label>
                            <Select value={penyusupan} onValueChange={(val: string) => setPenyusupan(val as PenyusupanType)}>
                                <SelectTrigger className="rounded-full mt-1 text-xs h-9">
                                    <SelectValue placeholder="Pilih..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">0 (Terpisah)</SelectItem>
                                    <SelectItem value="1">1 (Bersentuhan)</SelectItem>
                                    <SelectItem value="2">2 (Tumpang tindih dpt dipisah)</SelectItem>
                                    <SelectItem value="3">3 (Tumpang tindih tdk dpt dipisah)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Kemajuan Persalinan & Kontraksi */}
                <div className="border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        Kemajuan Persalinan &amp; Kontraksi
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div>
                            <Label className="text-[11px] text-slate-600">Pembukaan (cm)</Label>
                            <Input
                                type="number"
                                step="0.5"
                                min="0"
                                max="10"
                                placeholder="0 - 10"
                                value={pembukaan}
                                onChange={(e) => setPembukaan(e.target.value)}
                                className="rounded-full mt-1 text-xs h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">Turun Kepala</Label>
                            <Input
                                type="number"
                                min="0"
                                max="5"
                                placeholder="0 - 5"
                                value={turunKepala}
                                onChange={(e) => setTurunKepala(e.target.value)}
                                className="rounded-full mt-1 text-xs h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">Jumlah Kontraksi</Label>
                            <Input
                                type="number"
                                min="1"
                                max="5"
                                placeholder="1 - 5x"
                                value={kontraksiJml}
                                onChange={(e) => setKontraksiJml(e.target.value)}
                                className="rounded-full mt-1 text-xs h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">Durasi Kontraksi</Label>
                            <Select value={kontraksiDur} onValueChange={(val: string) => setKontraksiDur(val as KontraksiDurasiType)}>
                                <SelectTrigger className="rounded-full mt-1 text-xs h-9">
                                    <SelectValue placeholder="Durasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<20">&lt; 20 detik (Titik)</SelectItem>
                                    <SelectItem value="20-40">20-40 detik (Garis)</SelectItem>
                                    <SelectItem value=">40">&gt; 40 detik (Solid)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Section 3: Vitals Ibu & Urin */}
                <div className="border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-600" />
                        Kondisi Ibu, Obat &amp; Urin
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div>
                            <Label className="text-[11px] text-slate-600">Nadi (x/mnt)</Label>
                            <Input
                                type="number"
                                min="50"
                                max="180"
                                placeholder="60-100"
                                value={nadi}
                                onChange={(e) => setNadi(e.target.value)}
                                className="rounded-full mt-1 text-xs h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">TD Sistol</Label>
                            <Input
                                type="number"
                                min="60"
                                max="220"
                                placeholder="120"
                                value={sistol}
                                onChange={(e) => setSistol(e.target.value)}
                                className="rounded-full mt-1 text-xs h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">TD Diastol</Label>
                            <Input
                                type="number"
                                min="40"
                                max="140"
                                placeholder="80"
                                value={diastol}
                                onChange={(e) => setDiastol(e.target.value)}
                                className="rounded-full mt-1 text-xs h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">Suhu (°C)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                min="35"
                                max="41"
                                placeholder="36.5"
                                value={suhu}
                                onChange={(e) => setSuhu(e.target.value)}
                                className="rounded-full mt-1 text-xs h-9"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                        <div>
                            <Label className="text-[11px] text-slate-600">Oksitosin &amp; Tetes</Label>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                                <Input placeholder="Unit" value={oksitosinUnit} onChange={(e) => setOksitosinUnit(e.target.value)} className="rounded-full text-xs h-9" />
                                <Input placeholder="Tetes" type="number" value={oksitosinTetes} onChange={(e) => setOksitosinTetes(e.target.value)} className="rounded-full text-xs h-9" />
                            </div>
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">Obat &amp; Cairan IV</Label>
                            <Input placeholder="Mis: RL 500ml" value={obatCairan} onChange={(e) => setObatCairan(e.target.value)} className="rounded-full mt-1 text-xs h-9" />
                        </div>
                        <div>
                            <Label className="text-[11px] text-slate-600">Urin (Prot/Aset/Vol)</Label>
                            <div className="grid grid-cols-3 gap-1 mt-1">
                                <Input placeholder="Prot" value={urinProtein} onChange={(e) => setUrinProtein(e.target.value)} className="rounded-full text-xs h-9 text-center" />
                                <Input placeholder="Aset" value={urinAseton} onChange={(e) => setUrinAseton(e.target.value)} className="rounded-full text-xs h-9 text-center" />
                                <Input placeholder="ml" type="number" value={urinVolume} onChange={(e) => setUrinVolume(e.target.value)} className="rounded-full text-xs h-9 text-center" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end pt-2 gap-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full text-xs">
                        Batal
                    </Button>
                    <Button type="submit" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6">
                        Simpan Observasi
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};
