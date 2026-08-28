<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PartografSession extends Model
{
    use HasFactory;

    protected $table = 'partograf_sessions';

    protected $fillable = [
        'user_id',
        'no_register',
        'no_puskesmas',
        'nama_ibu',
        'umur_ibu',
        'gravida',
        'para',
        'abortus',
        'tanggal',
        'jam_masuk',
        'ketuban_pecah_sejak',
        'mules_sejak',
        'status',
        'catatan',
        'nama_bidan',
    ];

    protected $casts = [
        'umur_ibu' => 'integer',
        'gravida' => 'integer',
        'para' => 'integer',
        'abortus' => 'integer',
        'tanggal' => 'date:Y-m-d',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(PartografEntry::class, 'partograf_session_id')->orderBy('kolom_idx');
    }
}
