<?php

namespace GGPHP\Absent\Models;

use GGPHP\Core\Models\UuidModel;

class AbsentType extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AbsentTypes';

    /**
     * Status on,off for absent type
     */
    const ON = 'ON';
    const OFF = 'OFF';
    /**
     * Type of absent
     */
    const ANNUAL_LEAVE = 'ANNUAL_LEAVE';
    const UNPAID_LEAVE = 'UNPAID_LEAVE';
    const QUIT_WORK = 'QUIT_WORK';
    const TYPE_OFF = 'OFF';
    // absent without leave
    const AWOL = 'AWOL';
    const ABSENT_EARLY = 'ABSENT_EARLY';
    const ABSENT_LATE = 'ABSENT_LATE';

    protected $fillable = [
        'Name', 'Status', 'Type',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function absentReason()
    {
        return $this->hasMany(AbsentReason::class, 'Id', 'AbsentTypeId');
    }
}
