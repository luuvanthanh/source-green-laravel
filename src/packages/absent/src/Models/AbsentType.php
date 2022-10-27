<?php

namespace GGPHP\Absent\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\WorkOnline\Models\WorkOnline;

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
    const ABSENT = 'ABSENT';
    const BUSINESS_TRAVEL = 'BUSINESS_TRAVEL';
    const ADD_TIME = 'ADD_TIME';
    const GO_OUT = 'GO_OUT';
    const MATERNITY_LEAVE = 'MATERNITY_LEAVE';
    const WORK_ONLINE = 'WORK_ONLINE';
    const WORK_HOME = 'WORK_HOME';

    protected $fillable = [
        'Name', 'Status', 'Type', 'Code', 'IsTimeKeeping',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function absentReason()
    {
        return $this->hasMany(AbsentReason::class, 'Id', 'AbsentTypeId');
    }
}
