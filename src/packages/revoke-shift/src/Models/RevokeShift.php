<?php

namespace GGPHP\RevokeShift\Models;

use GGPHP\Core\Models\UuidModel;

class RevokeShift extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'revoke_shifts';

    protected $fillable = [
        'shift_id', 'employee_id', 'date_violation', 'status_work_declaration',
    ];

    protected $dateTimeFields = [
        'date_violation',
    ];

    protected $casts = [
        'date_violation' => 'datetime',
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
        return $this->hasOne(\GGPHP\ShiftSchedule\Models\Shift::class, 'id', 'shift_id');
    }

    /**
     * @return mixed
     */
    public function timekeeping()
    {
        return $this->employee->timekeeping()->whereDate('attended_at', $this->date_violation);
    }

}
