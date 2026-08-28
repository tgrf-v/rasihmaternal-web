<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartografEntry extends Model
{
    use HasFactory;

    protected $table = 'partograf_entries';

    protected $fillable = [
        'partograf_session_id',
        'waktu_observasi',
        'jam_ke',
        'kolom_idx',
        'djj',
        'air_ketuban',
        'penyusupan',
        'pembukaan_serviks',
        'penurunan_kepala',
        'kontraksi_jumlah',
        'kontraksi_durasi',
        'oksitosin_unit',
        'oksitosin_tetes',
        'obat_cairan_iv',
        'nadi',
        'sistol',
        'diastol',
        'suhu',
        'urin_protein',
        'urin_aseton',
        'urin_volume',
    ];

    protected $casts = [
        'jam_ke' => 'integer',
        'kolom_idx' => 'integer',
        'djj' => 'integer',
        'pembukaan_serviks' => 'float',
        'penurunan_kepala' => 'integer',
        'kontraksi_jumlah' => 'integer',
        'oksitosin_tetes' => 'integer',
        'nadi' => 'integer',
        'sistol' => 'integer',
        'diastol' => 'integer',
        'suhu' => 'float',
        'urin_volume' => 'integer',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(PartografSession::class, 'partograf_session_id');
    }
}
