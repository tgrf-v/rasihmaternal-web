import React, { useState } from 'react';
import { PartografHeaderData } from '@/types/partograf';
import { Dialog } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

interface PartografCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (header: PartografHeaderData) => void;
}

export const PartografCreateModal: React.FC<PartografCreateModalProps> = ({ open, onOpenChange, onCreate }) => {
    const [noRegister, setNoRegister] = useState('REG-2026-0801');
    const [noPuskesmas, setNoPuskesmas] = useState('PKM-04');
    const [namaIbu, setNamaIbu] = useState('Ny. Siti Rahma');
    const [umurIbu, setUmurIbu] = useState('26');
    const [gravida, setGravida] = useState('2');
    const [para, setPara] = useState('1');
    const [abortus, setAbortus] = useState('0');
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [jamMasuk, setJamMasuk] = useState('08:00');
    const [ketubanPecah, setKetubanPecah] = useState('07:30');
    const [mulesSejak, setMulesSejak] = useState('04:00');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const header: PartografHeaderData = {
            id: `session-${Date.now()}`,
            no_register: noRegister,
            no_puskesmas: noPuskesmas,
            nama_ibu: namaIbu,
            umur_ibu: Number(umurIbu) || 25,
            gravida: Number(gravida) || 1,
            para: Number(para) || 0,
            abortus: Number(abortus) || 0,
            tanggal,
            jam_masuk: jamMasuk,
            ketuban_pecah_sejak: ketubanPecah || null,
            mules_sejak: mulesSejak || null,
            status: 'aktif',
        };
        onCreate(header);
        onOpenChange(false);
    };

    return (
        <Dialog
            isOpen={open}
            onClose={() => onOpenChange(false)}
            title="Mulai Lembar Partograf Baru"
            description="Isi identitas ibu dan waktu awal observasi fase aktif"
            className="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">No. Register</Label>
                        <Input value={noRegister} onChange={(e) => setNoRegister(e.target.value)} className="rounded-full mt-1 text-xs h-9" required />
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">No. Puskesmas / Faskes</Label>
                        <Input value={noPuskesmas} onChange={(e) => setNoPuskesmas(e.target.value)} className="rounded-full mt-1 text-xs h-9" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <Label className="text-xs font-semibold text-slate-600">Nama Ibu Bersalin</Label>
                        <Input value={namaIbu} onChange={(e) => setNamaIbu(e.target.value)} className="rounded-full mt-1 text-xs h-9" required />
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Umur (Tahun)</Label>
                        <Input type="number" value={umurIbu} onChange={(e) => setUmurIbu(e.target.value)} className="rounded-full mt-1 text-xs h-9" required />
                    </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl">
                    <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Paritas Pasien</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <Label className="text-[10px] text-slate-500">Gravida (G)</Label>
                            <Input type="number" min="1" value={gravida} onChange={(e) => setGravida(e.target.value)} className="rounded-full bg-white text-xs h-8 text-center" />
                        </div>
                        <div>
                            <Label className="text-[10px] text-slate-500">Para (P)</Label>
                            <Input type="number" min="0" value={para} onChange={(e) => setPara(e.target.value)} className="rounded-full bg-white text-xs h-8 text-center" />
                        </div>
                        <div>
                            <Label className="text-[10px] text-slate-500">Abortus (A)</Label>
                            <Input type="number" min="0" value={abortus} onChange={(e) => setAbortus(e.target.value)} className="rounded-full bg-white text-xs h-8 text-center" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Tanggal Observasi</Label>
                        <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="rounded-full mt-1 text-xs h-9" required />
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Jam Masuk (WIB)</Label>
                        <Input type="time" value={jamMasuk} onChange={(e) => setJamMasuk(e.target.value)} className="rounded-full mt-1 text-xs h-9" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Ketuban Pecah Sejak</Label>
                        <Input type="time" value={ketubanPecah} onChange={(e) => setKetubanPecah(e.target.value)} className="rounded-full mt-1 text-xs h-9" />
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Mules Sejak Jam</Label>
                        <Input type="time" value={mulesSejak} onChange={(e) => setMulesSejak(e.target.value)} className="rounded-full mt-1 text-xs h-9" />
                    </div>
                </div>

                <div className="flex items-center justify-end pt-3 gap-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full text-xs">
                        Batal
                    </Button>
                    <Button type="submit" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6">
                        Buka Lembar Partograf
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};
