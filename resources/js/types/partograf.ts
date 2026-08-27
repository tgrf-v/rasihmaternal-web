export type AirKetubanType = 'U' | 'J' | 'M' | 'D' | 'K';
export type PenyusupanType = '0' | '1' | '2' | '3';
export type KontraksiDurasiType = '<20' | '20-40' | '>40';
export type PartografStatusType = 'aktif' | 'selesai' | 'dirujuk';

export interface PartografHeaderData {
    id: string;
    no_register: string;
    no_puskesmas: string;
    nama_ibu: string;
    umur_ibu: number;
    gravida: number;
    para: number;
    abortus: number;
    tanggal: string;
    jam_masuk: string;
    ketuban_pecah_sejak?: string | null;
    mules_sejak?: string | null;
    status: PartografStatusType;
    catatan?: string | null;
    nama_bidan?: string;
}

export interface PartografEntryData {
    id: string;
    partograf_session_id: string;
    waktu_observasi: string; // misal "08:00", "08:30"
    jam_ke: number; // 1 s/d 16
    kolom_idx: number; // 0 s/d 31 (setiap kolom = 30 menit)

    // Denyut Jantung Janin (80 - 200)
    djj?: number | null;

    // Cairan Ketuban & Penyusupan
    air_ketuban?: AirKetubanType | null;
    penyusupan?: PenyusupanType | null;

    // Pembukaan Serviks (0 - 10) & Turun Kepala (0 - 5)
    pembukaan_serviks?: number | null; // cm, 0 - 10
    penurunan_kepala?: number | null; // perlimaan, 0 - 5

    // Kontraksi Tiap 10 Menit
    kontraksi_jumlah?: number | null; // 1 - 5
    kontraksi_durasi?: KontraksiDurasiType | null;

    // Oksitosin & Cairan IV
    oksitosin_unit?: string | null;
    oksitosin_tetes?: number | null;
    obat_cairan_iv?: string | null;

    // Tanda Vital Ibu
    nadi?: number | null; // 60 - 180
    sistol?: number | null; // 60 - 200
    diastol?: number | null; // 40 - 120
    suhu?: number | null; // Celsius misal 36.8

    // Urin
    urin_protein?: string | null; // -, +, ++, +++
    urin_aseton?: string | null; // -, +, ++
    urin_volume?: number | null; // ml
}

export interface PartografAlertStatus {
    isActionLineCrossed: boolean;
    isAlertLineCrossed: boolean;
    isDjjAbnormal: boolean;
    djjStatusText: string;
    progressStatusText: string;
}
