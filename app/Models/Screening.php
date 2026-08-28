<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Screening extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        // Relasi
        'ibu_hamil_id',
        'bidan_id',
        'tipe_screening',

        // Input DSS
        'nama_pasien',
        'nik',
        'pekerjaan',
        'pendidikan',
        'umur',
        'paritas',
        'hpht',
        'sistolik',
        'diastolik',
        'edema_level',
        'keluhan_spesifik',
        'sudah_dapat_treatment',
        'detail_treatment',
        'wilayah_puskesmas',

        // Input ES (Bidan)
        'gravida',
        'abortus',
        'imt',
        'letak_janin',
        'umur_kehamilan',
        'jenis_persalinan',
        'hb',
        'leokosit',
        'trombosit',

        // Persalinan-specific
        'posisi_janin',
        'ada_riwayat_sc',
        'kondisi_ketuban',

        // Output kalkulasi
        'kode_screening',
        'skor_kspr',
        'map_value',
        'tingkat_risiko',
        'kategori_risiko',
        'status_label',
        'diagnosa_komplikasi',
        'rekomendasi_faskes',
        'rekomendasi_tempat',
        'penolong_persalinan',
        'saran_terapi',
        'detail_skor',
        'taksiran_hpl',

        // Output ML (FastAPI Microservice)
        'diagnosa_ml',
        'kategori_ml',
        'skor_risiko_ml',
        'probabilitas_ml',

        // Clinical Model v2 Fields
        'tinggi_badan',
        'berat_badan',
        'uk_minggu',
        'uk_hari',
        'jumlah_janin',
        'presentasi_janin',
        'efw_bayi_gram',
        'nadi',
        'suhu',
        'proteinuria',
        'status_ketuban',
        'lama_ketuban_pecah_jam',
        'pembukaan_cm',
        'station_kepala',
        'kontraksi_10menit',
        'durasi_kontraksi_detik',
        'djj',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'keluhan_spesifik' => 'array',
            'diagnosa_komplikasi' => 'array',
            'saran_terapi' => 'array',
            'detail_skor' => 'array',
            'probabilitas_ml' => 'array',
            'sudah_dapat_treatment' => 'boolean',
            'ada_riwayat_sc' => 'boolean',
            'map_value' => 'decimal:2',
            'imt' => 'decimal:2',
            'hb' => 'decimal:2',
            'tinggi_badan' => 'decimal:2',
            'berat_badan' => 'decimal:2',
            'suhu' => 'decimal:2',
            'efw_bayi_gram' => 'decimal:2',
            'lama_ketuban_pecah_jam' => 'decimal:2',
            'pembukaan_cm' => 'decimal:2',
            'station_kepala' => 'decimal:1',
            'skor_risiko_ml' => 'decimal:2',
        ];
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function ibuHamil(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ibu_hamil_id');
    }

    public function bidan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'bidan_id');
    }
}
