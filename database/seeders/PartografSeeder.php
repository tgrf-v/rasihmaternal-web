<?php

namespace Database\Seeders;

use App\Models\PartografEntry;
use App\Models\PartografSession;
use App\Models\User;
use Illuminate\Database\Seeder;

class PartografSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bidan = User::where('role', 'bidan')->first() ?? User::first();

        // 1. Sesi Persalinan Aktif (Ny. Siti Nurhaliza)
        $session1 = PartografSession::firstOrCreate(
            ['no_register' => 'REG-2026-0819'],
            [
                'user_id' => $bidan?->id,
                'no_puskesmas' => 'PKM-SEHAT-01',
                'nama_ibu' => 'Ny. Siti Nurhaliza',
                'umur_ibu' => 27,
                'gravida' => 2,
                'para' => 1,
                'abortus' => 0,
                'tanggal' => now()->format('Y-m-d'),
                'jam_masuk' => '08:00',
                'ketuban_pecah_sejak' => '07:30 WIB',
                'mules_sejak' => '03:00 WIB',
                'status' => 'aktif',
                'catatan' => 'Kemajuan fase aktif berjalan normal dan terpantau dengan baik.',
                'nama_bidan' => $bidan?->name ?? 'Bidan Sari',
            ]
        );

        $entriesData1 = [
            [
                'kolom_idx' => 0,
                'waktu_observasi' => '08:00',
                'jam_ke' => 1,
                'djj' => 140,
                'air_ketuban' => 'U',
                'penyusupan' => '0',
                'pembukaan_serviks' => 4.0,
                'penurunan_kepala' => 4,
                'kontraksi_jumlah' => 2,
                'kontraksi_durasi' => '<20',
                'nadi' => 80,
                'sistol' => 120,
                'diastol' => 80,
                'suhu' => 36.6,
                'urin_protein' => '-',
                'urin_aseton' => '-',
                'urin_volume' => 150,
            ],
            [
                'kolom_idx' => 1,
                'waktu_observasi' => '08:30',
                'jam_ke' => 1,
                'djj' => 144,
                'kontraksi_jumlah' => 2,
                'kontraksi_durasi' => '20-40',
                'nadi' => 82,
            ],
            [
                'kolom_idx' => 2,
                'waktu_observasi' => '09:00',
                'jam_ke' => 2,
                'djj' => 138,
                'air_ketuban' => 'J',
                'penyusupan' => '0',
                'kontraksi_jumlah' => 3,
                'kontraksi_durasi' => '20-40',
                'nadi' => 84,
            ],
            [
                'kolom_idx' => 3,
                'waktu_observasi' => '09:30',
                'jam_ke' => 2,
                'djj' => 142,
                'kontraksi_jumlah' => 3,
                'kontraksi_durasi' => '20-40',
                'nadi' => 80,
            ],
            [
                'kolom_idx' => 4,
                'waktu_observasi' => '10:00',
                'jam_ke' => 3,
                'djj' => 136,
                'air_ketuban' => 'J',
                'penyusupan' => '1',
                'kontraksi_jumlah' => 3,
                'kontraksi_durasi' => '20-40',
                'nadi' => 86,
                'sistol' => 120,
                'diastol' => 80,
                'suhu' => 36.8,
            ],
            [
                'kolom_idx' => 5,
                'waktu_observasi' => '10:30',
                'jam_ke' => 3,
                'djj' => 140,
                'kontraksi_jumlah' => 4,
                'kontraksi_durasi' => '20-40',
                'nadi' => 84,
            ],
            [
                'kolom_idx' => 6,
                'waktu_observasi' => '11:00',
                'jam_ke' => 4,
                'djj' => 144,
                'air_ketuban' => 'J',
                'penyusupan' => '1',
                'kontraksi_jumlah' => 4,
                'kontraksi_durasi' => '>40',
                'nadi' => 88,
            ],
            [
                'kolom_idx' => 7,
                'waktu_observasi' => '11:30',
                'jam_ke' => 4,
                'djj' => 140,
                'kontraksi_jumlah' => 4,
                'kontraksi_durasi' => '>40',
                'nadi' => 86,
            ],
            [
                'kolom_idx' => 8,
                'waktu_observasi' => '12:00',
                'jam_ke' => 5,
                'djj' => 138,
                'air_ketuban' => 'J',
                'penyusupan' => '1',
                'pembukaan_serviks' => 7.5,
                'penurunan_kepala' => 2,
                'kontraksi_jumlah' => 4,
                'kontraksi_durasi' => '>40',
                'nadi' => 88,
                'sistol' => 125,
                'diastol' => 80,
                'suhu' => 36.7,
                'urin_protein' => '-',
                'urin_aseton' => '-',
                'urin_volume' => 120,
            ],
        ];

        foreach ($entriesData1 as $entry) {
            PartografEntry::firstOrCreate(
                [
                    'partograf_session_id' => $session1->id,
                    'kolom_idx' => $entry['kolom_idx'],
                ],
                $entry
            );
        }

        // 2. Sesi Persalinan Selesai (Ny. Ratna Sari Dewi)
        PartografSession::firstOrCreate(
            ['no_register' => 'REG-2026-0815'],
            [
                'user_id' => $bidan?->id,
                'no_puskesmas' => 'PKM-SEHAT-01',
                'nama_ibu' => 'Ny. Ratna Sari Dewi',
                'umur_ibu' => 31,
                'gravida' => 3,
                'para' => 2,
                'abortus' => 0,
                'tanggal' => now()->subDays(2)->format('Y-m-d'),
                'jam_masuk' => '14:20',
                'ketuban_pecah_sejak' => '13:00 WIB',
                'mules_sejak' => '09:00 WIB',
                'status' => 'selesai',
                'catatan' => 'Lahir spontan pervaginam bayi laki-laki BB 3.200 gram, APGAR 9/10.',
                'nama_bidan' => $bidan?->name ?? 'Bidan Sari',
            ]
        );
    }
}
