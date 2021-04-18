<?php

namespace GGPHP\RevokeShift\Models;

use GGPHP\Core\Models\UuidModel;

class RevokeShift extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'RevokeShifts';

    protected $fillable = [
        'ShiftId', 'EmployeeId', 'DateViolation', 'StatusWorkDeclaration',
    ];

    protected $dateTimeFields = [
        'DateViolation',
    ];

    protected $casts = [
        'DateViolation' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function shift()
    {
        return $this->hasOne(\GGPHP\ShiftSchedule\Models\Shift::class, 'Id', 'ShiftId');
    }

    /**
     * @return mixed
     */
    public function timekeeping()
    {
        return $this->employee->timekeeping()->whereDate('AttendedAt', $this->DateViolation);
    }

}
