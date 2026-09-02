<?php

namespace Database\Seeders;

use App\Models\BidanProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleBidanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'Bidan Siti Rahayu, S.Tr.Keb',
                'email' => 'siti.rahayu@rasihmaternal.test',
                'no_telepon' => '081234567891',
                'no_str' => 'STR-BDN-2026-0912',
                'puskesmas' => 'Puskesmas Kecamatan Cilandak',
            ],
            [
                'name' => 'Bidan Nur Azizah, A.Md.Keb',
                'email' => 'nur.azizah@rasihmaternal.test',
                'no_telepon' => '081388776655',
                'no_str' => 'STR-BDN-2025-4421',
                'puskesmas' => 'Puskesmas Kebayoran Baru',
            ],
            [
                'name' => 'Bidan Ratna Dewi, S.Keb., Bdn',
                'email' => 'ratna.dewi@rasihmaternal.test',
                'no_telepon' => '081922334455',
                'no_str' => 'STR-BDN-2026-1188',
                'puskesmas' => 'Puskesmas Pasar Minggu',
            ],
            [
                'name' => 'Bidan Indah Permatasari, S.Tr.Keb',
                'email' => 'indah.permata@rasihmaternal.test',
                'no_telepon' => '085711223344',
                'no_str' => 'STR-BDN-2026-7890',
                'puskesmas' => 'Puskesmas Jagakarsa',
            ],
            [
                'name' => 'Bidan Dian Kartika, A.Md.Keb',
                'email' => 'dian.kartika@rasihmaternal.test',
                'no_telepon' => '082155667788',
                'no_str' => 'STR-BDN-2025-3310',
                'puskesmas' => 'Puskesmas Tebet',
            ],
            [
                'name' => 'Bidan Sri Wahyuni, S.Tr.Keb',
                'email' => 'sri.wahyuni@rasihmaternal.test',
                'no_telepon' => '081899001122',
                'no_str' => 'STR-BDN-2026-5542',
                'puskesmas' => 'Puskesmas Mampang Prapatan',
            ],
            [
                'name' => 'Bidan Maya Anggraini, S.Tr.Keb',
                'email' => 'maya.anggraini@rasihmaternal.test',
                'no_telepon' => '081766554433',
                'no_str' => 'STR-BDN-2026-9081',
                'puskesmas' => 'Puskesmas Pancoran',
            ],
            [
                'name' => 'Bidan Fitri Handayani, A.Md.Keb',
                'email' => 'fitri.handayani@rasihmaternal.test',
                'no_telepon' => '085233445566',
                'no_str' => 'STR-BDN-2025-1102',
                'puskesmas' => 'Puskesmas Pesanggrahan',
            ],
        ];

        foreach ($data as $item) {
            $user = User::firstOrCreate(
                ['email' => $item['email']],
                [
                    'name' => $item['name'],
                    'password' => Hash::make('password'),
                    'role' => 'bidan',
                    'no_telepon' => $item['no_telepon'],
                ]
            );

            BidanProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'no_str' => $item['no_str'],
                    'puskesmas_wilayah' => $item['puskesmas'],
                ]
            );
        }
    }
}
