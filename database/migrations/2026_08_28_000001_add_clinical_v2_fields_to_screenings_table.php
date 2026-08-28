<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('screenings', function (Blueprint $table) {
            if (!Schema::hasColumn('screenings', 'tinggi_badan')) {
                $table->decimal('tinggi_badan', 5, 2)->nullable()->after('abortus');
            }
            if (!Schema::hasColumn('screenings', 'berat_badan')) {
                $table->decimal('berat_badan', 5, 2)->nullable()->after('tinggi_badan');
            }
            if (!Schema::hasColumn('screenings', 'uk_minggu')) {
                $table->integer('uk_minggu')->nullable()->after('umur_kehamilan');
            }
            if (!Schema::hasColumn('screenings', 'uk_hari')) {
                $table->integer('uk_hari')->nullable()->after('uk_minggu');
            }
            if (!Schema::hasColumn('screenings', 'jumlah_janin')) {
                $table->integer('jumlah_janin')->default(1)->after('uk_hari');
            }
            if (!Schema::hasColumn('screenings', 'presentasi_janin')) {
                $table->string('presentasi_janin')->nullable()->after('letak_janin');
            }
            if (!Schema::hasColumn('screenings', 'efw_bayi_gram')) {
                $table->decimal('efw_bayi_gram', 7, 2)->nullable()->after('presentasi_janin');
            }
            if (!Schema::hasColumn('screenings', 'nadi')) {
                $table->integer('nadi')->nullable()->after('diastolik');
            }
            if (!Schema::hasColumn('screenings', 'suhu')) {
                $table->decimal('suhu', 4, 2)->nullable()->after('nadi');
            }
            if (!Schema::hasColumn('screenings', 'proteinuria')) {
                $table->string('proteinuria')->nullable()->after('suhu');
            }
            if (!Schema::hasColumn('screenings', 'status_ketuban')) {
                $table->string('status_ketuban')->nullable()->after('kondisi_ketuban');
            }
            if (!Schema::hasColumn('screenings', 'lama_ketuban_pecah_jam')) {
                $table->decimal('lama_ketuban_pecah_jam', 5, 2)->nullable()->after('status_ketuban');
            }
            if (!Schema::hasColumn('screenings', 'pembukaan_cm')) {
                $table->decimal('pembukaan_cm', 4, 2)->nullable()->after('lama_ketuban_pecah_jam');
            }
            if (!Schema::hasColumn('screenings', 'station_kepala')) {
                $table->decimal('station_kepala', 3, 1)->nullable()->after('pembukaan_cm');
            }
            if (!Schema::hasColumn('screenings', 'kontraksi_10menit')) {
                $table->integer('kontraksi_10menit')->nullable()->after('station_kepala');
            }
            if (!Schema::hasColumn('screenings', 'durasi_kontraksi_detik')) {
                $table->integer('durasi_kontraksi_detik')->nullable()->after('kontraksi_10menit');
            }
            if (!Schema::hasColumn('screenings', 'djj')) {
                $table->integer('djj')->nullable()->after('durasi_kontraksi_detik');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('screenings', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
