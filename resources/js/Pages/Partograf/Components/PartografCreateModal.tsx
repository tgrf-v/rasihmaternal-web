import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

interface PartografCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PartografCreateModal: React.FC<PartografCreateModalProps> = ({ open, onOpenChange }) => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().slice(0, 5);

    const [noRegister, setNoRegister] = useState('');
    const [noPuskesmas, setNoPuskesmas] = useState('');
    const [namaIbu, setNamaIbu] = useState('');
    const [umurIbu, setUmurIbu] = useState('');
    const [gravida, setGravida] = useState('1');
    const [para, setPara] = useState('0');
    const [abortus, setAbortus] = useState('0');
    const [tanggal, setTanggal] = useState(today);
    const [jamMasuk, setJamMasuk] = useState(currentTime);
    const [ketubanPecah, setKetubanPecah] = useState('');
    const [mulesSejak, setMulesSejak] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            '/partograf',
            {
                no_register: noRegister || undefined,
                no_puskesmas: noPuskesmas || undefined,
                nama_ibu: namaIbu,
                umur_ibu: Number(umurIbu) || 25,
                gravida: Number(gravida) || 1,
                para: Number(para) || 0,
                abortus: Number(abortus) || 0,
                tanggal,
                jam_masuk: jamMasuk,
                ketuban_pecah_sejak: ketubanPecah ? `${ketubanPecah} WIB` : null,
                mules_sejak: mulesSejak ? `${mulesSejak} WIB` : null,
                status: 'aktif',
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    onOpenChange(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog
            isOpen={open}
            onClose={() => onOpenChange(false)}
            title="Mulai Lembar Partograf Baru"
            description="Isi identitas ibu dan waktu awal observasi fase aktif persalinan"
            className="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">No. Register (Opsional)</Label>
                        <Input
                            placeholder="Otomatis jika kosong"
                            value={noRegister}
                            onChange={(e) => setNoRegister(e.target.value)}
                            className="rounded-full mt-1 text-xs h-9"
                        />
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">No. Puskesmas / Faskes</Label>
                        <Input
                            placeholder="Contoh: PKM-01"
                            value={noPuskesmas}
                            onChange={(e) => setNoPuskesmas(e.target.value)}
                            className="rounded-full mt-1 text-xs h-9"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <Label className="text-xs font-semibold text-slate-600">
                            Nama Ibu Bersalin <span className="text-rose-600">*</span>
                        </Label>
                        <Input
                            placeholder="Contoh: Ny. Siti Rahma"
                            value={namaIbu}
                            onChange={(e) => setNamaIbu(e.target.value)}
                            className="rounded-full mt-1 text-xs h-9"
                            required
                        />
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">
                            Umur (Tahun) <span className="text-rose-600">*</span>
                        </Label>
                        <Input
                            type="number"
                            min="12"
                            max="65"
                            placeholder="26"
                            value={umurIbu}
                            onChange={(e) => setUmurIbu(e.target.value)}
                            className="rounded-full mt-1 text-xs h-9"
                            required
                        />
                    </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">Paritas Pasien</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <Label className="text-[10px] text-slate-500">Gravida (G)</Label>
                            <Input
                                type="number"
                                min="1"
                                value={gravida}
                                onChange={(e) => setGravida(e.target.value)}
                                className="rounded-full bg-white text-xs h-8 text-center"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] text-slate-500">Para (P)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={para}
                                onChange={(e) => setPara(e.target.value)}
                                className="rounded-full bg-white text-xs h-8 text-center"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] text-slate-500">Abortus (A)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={abortus}
                                onChange={(e) => setAbortus(e.target.value)}
                                className="rounded-full bg-white text-xs h-8 text-center"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">
                            Tanggal Observasi <span className="text-rose-600">*</span>
                        </Label>
                        <Input
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            className="rounded-full mt-1 text-xs h-9"
                            required
                        />
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">
                            Jam Masuk (WIB) <span className="text-rose-600">*</span>
                        </Label>
                        <Input
                            type="time"
                            value={jamMasuk}
                            onChange={(e) => setJamMasuk(e.target.value)}
                            className="rounded-full mt-1 text-xs h-9"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Ketuban Pecah Sejak (Opsional)</Label>
                        <Input
                            type="time"
                            value={ketubanPecah}
                            onChange={(e) => setKetubanPecah(e.target.value)}
                            className="rounded-full mt-1 text-xs h-9"
                        />
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-slate-600">Mules Sejak Jam (Opsional)</Label>
                        <Input
                            type="time"
                            value={mulesSejak}
                            onChange={(e) => setMulesSejak(e.target.value)}
                            className="rounded-full mt-1 text-xs h-9"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end pt-3 gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-full text-xs"
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6"
                    >
                        {isSubmitting ? 'Memproses...' : 'Buka Lembar Partograf'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};
