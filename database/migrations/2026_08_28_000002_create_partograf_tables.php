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
        Schema::create('partograf_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('no_register')->index();
            $table->string('no_puskesmas')->nullable();
            $table->string('nama_ibu');
            $table->integer('umur_ibu');
            $table->integer('gravida')->default(1);
            $table->integer('para')->default(0);
            $table->integer('abortus')->default(0);
            $table->date('tanggal');
            $table->string('jam_masuk');
            $table->string('ketuban_pecah_sejak')->nullable();
            $table->string('mules_sejak')->nullable();
            $table->enum('status', ['aktif', 'selesai', 'dirujuk'])->default('aktif');
            $table->text('catatan')->nullable();
            $table->string('nama_bidan')->nullable();
            $table->timestamps();
        });

        Schema::create('partograf_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partograf_session_id')->constrained('partograf_sessions')->cascadeOnDelete();
            $table->string('waktu_observasi');
            $table->integer('jam_ke');
            $table->integer('kolom_idx'); // 0 - 31

            // Parameter Janin
            $table->integer('djj')->nullable();
            $table->string('air_ketuban', 5)->nullable(); // U, J, M, D, K
            $table->string('penyusupan', 5)->nullable(); // 0, 1, 2, 3

            // Kemajuan Persalinan
            $table->decimal('pembukaan_serviks', 4, 1)->nullable(); // 0 - 10 cm
            $table->integer('penurunan_kepala')->nullable(); // 0 - 5 perlimaan

            // Kontraksi
            $table->integer('kontraksi_jumlah')->nullable(); // 1 - 5
            $table->string('kontraksi_durasi', 20)->nullable(); // <20, 20-40, >40

            // Oksitosin & Cairan IV
            $table->string('oksitosin_unit')->nullable();
            $table->integer('oksitosin_tetes')->nullable();
            $table->string('obat_cairan_iv')->nullable();

            // Tanda Vital Ibu
            $table->integer('nadi')->nullable();
            $table->integer('sistol')->nullable();
            $table->integer('diastol')->nullable();
            $table->decimal('suhu', 4, 1)->nullable();

            // Urin
            $table->string('urin_protein', 10)->nullable();
            $table->string('urin_aseton', 10)->nullable();
            $table->integer('urin_volume')->nullable();

            $table->timestamps();

            $table->unique(['partograf_session_id', 'kolom_idx']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partograf_entries');
        Schema::dropIfExists('partograf_sessions');
    }
};
