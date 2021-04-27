<?php

namespace GGPHP\Absent\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class Absent extends UuidModel
{
    public $incrementing = false;

    protected $table = 'Absents';

    protected $fillable = [
        'AbsentTypeId', 'AbsentReasonId', 'EmployeeId', 'StartDate', 'EndDate',
    ];

    protected $dateTimeFields = [
        'StartDate',
        'EndDate',
    ];

    protected $casts = [
        'StartDate' => 'datetime',
        'EndDate' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentType()
    {
        return $this->belongsTo(AbsentType::class, 'AbsentTypeId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentReason()
    {
        return $this->belongsTo(AbsentReason::class, 'AbsentReasonId');
    }
}
