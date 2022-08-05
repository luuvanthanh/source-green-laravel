<?php

namespace GGPHP\TeacherTimekeeping\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper;
use GGPHP\Users\Models\User;

class TeacherTimekeeping extends UuidModel
{
    public $incrementing = false;

    protected $table = 'TeacherTimekeepings';

    const STATUS = [
        'START' => 1,
        'DOING' => 2,
        'FINISH' => 3
    ];

    const TYPE = [
        'MANUAL' => 1,
        'FINGERPRINT' => 2,
        'CARD' => 3,
        'PHONE' => 4
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Status', 'Type', 'AttendedAt', 'StartTime', 'EndTime', 'TotalHourWorked', 'OverTimeHour'
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
}
