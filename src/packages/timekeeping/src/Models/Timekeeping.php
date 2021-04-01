<?php

namespace GGPHP\Timekeeping\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper;
use GGPHP\Users\Models\User;

class Timekeeping extends UuidModel
{
    public $incrementing = false;

    const CHECK_IN = 'CHECK_IN';
    const CHECK_OUT = 'CHECK_OUT';
    const TYPE_FINGERPRINT = '1';
    const TYPE_CARD = '2';
    const TYPE_CARD_FORCE = '4';
    const PART_TIME = 'PART_TIME';
    const MONTH = 'MONTH';
    const ALLOW_START_TIME = 'ALLOW_START_TIME';
    const ALLOW_END_TIME = 'ALLOW_END_TIME';
    const TYPE_COLLECTION = [
        '1' => 'FINGERPRINT',
        '2' => 'CARD',
        '4' => 'CARD',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'device_id', 'type', 'attended_at', 'tracking_type',
    ];

    protected $dateTimeFields = [
        'attended_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'attended_at' => 'datetime',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function fingerprintTimekeeper()
    {
        return $this->belongsTo(FingerprintTimekeeper::class, 'device_id');
    }
}
