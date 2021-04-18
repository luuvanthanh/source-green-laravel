<?php

namespace GGPHP\Timekeeping\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper;
use GGPHP\Users\Models\User;

class Timekeeping extends UuidModel
{
    public $incrementing = false;

    protected $table = 'Timekeepings';

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
        'EmployeeId', 'DeviceId', 'Type', 'AttendedAt', 'TrackingType',
    ];

    protected $dateTimeFields = [
        'AttendedAt',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'AttendedAt' => 'datetime',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(User::class);
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function fingerprintTimekeeper()
    {
        return $this->belongsTo(FingerprintTimekeeper::class, 'DeviceId');
    }
}
