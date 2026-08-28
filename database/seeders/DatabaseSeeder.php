<?php

namespace Database\Seeders;

use App\Models\BidanProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Superadmin
        User::firstOrCreate(
            ['email' => 'surtiningsih@uhb.ac.id'],
            [
                'name' => 'Surtiningsih (Superadmin)',
                'password' => Hash::make('password'),
                'role' => 'superadmin',
                'no_telepon' => '081200000000',
            ]
        );

        User::firstOrCreate(
            ['email' => 'superadmin@bundasehat.test'],
            [
                'name' => 'Bu Asih (Superadmin)',
                'password' => Hash::make('password'),
                'role' => 'superadmin',
                'no_telepon' => '081200000001',
            ]
        );

        // 2. Bidan (Bidan Wilayah Demo)
        $bidan = User::firstOrCreate(
            ['email' => 'bidan@bundasehat.test'],
            [
                'name' => 'Bidan Sari',
                'password' => Hash::make('password'),
                'role' => 'bidan',
                'no_telepon' => '081200000002',
            ]
        );

        BidanProfile::firstOrCreate(
            ['user_id' => $bidan->id],
            [
                'no_str' => 'STR-BDN-2026-001',
                'puskesmas_wilayah' => 'Puskesmas Kecamatan Cilandak',
            ]
        );

        // 3. Ibu Hamil (Pasien Demo)
        User::firstOrCreate(
            ['email' => 'ibuhamil@bundasehat.test'],
            [
                'name' => 'Ibu Rahma Rahayu',
                'password' => Hash::make('password'),
                'role' => 'ibu_hamil',
                'no_telepon' => '081200000003',
            ]
        );

        // 4. Kamus Kesehatan & Terapi Komplementer
        $this->call(KamusItemSeeder::class);

        // 5. Partograf Digital Demo Data
        $this->call(PartografSeeder::class);
    }
}
