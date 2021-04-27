<?php

namespace GGPHP\LateEarly\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\LateEarly\Presenters\LateEarlyPresenter;
use GGPHP\Users\Models\User;

class LateEarly extends UuidModel
{
    public $incrementing = false;

    const LATE = 'LATE';
    const EARLY = 'EARLY';

    /**
     * Status LateEarly
     */
    const PENDING = 'PENDING';
    const APPROVED = 'APPROVED';
    const DECLINED = 'DECLINED';
    const CANCELED = 'CANCELED';
    const AUTOMATIC_APPROVE = 'AUTOMATIC_APPROVE';
    const INVALID = 'INVALID';

    /**
     * Declare the table name
     */
    protected $table = 'LateEarlies';

    protected $fillable = [
        'TimeConfigType', 'Time', 'Date', 'Status', 'EmployeeId',
        'TimeShift', 'ShiftCode', 'TimeSlot', 'TimeViolation',
    ];

    protected $presenter = LateEarlyPresenter::class;

    protected $dateTimeFields = [
        'Date',
    ];

    protected $casts = [
        'Date' => 'datetime',
    ];
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function lateEarlyConfig()
    {
        return $this->belongsTo(LateEarlyTimeConfig::class, 'TimeConfigType');
    }

    /**
     * @return mixed
     */
    public function timekeeping()
    {
        return $this->employee->timekeeping()->whereDate('AttendedAt', $this->date);
    }

    /**
     * Get type attribute
     */
    public function getTypeAttribute()
    {
        return $this->lateEarlyConfig->type;
    }

    /**
     * Return approval requests relations via moprhMany.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function workDeclarationDetail()
    {
        return $this->morphOne(\GGPHP\WorkDeclaration\Models\WorkDeclarationDetail::class, 'Model');
    }
}
