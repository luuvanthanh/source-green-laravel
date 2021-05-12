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
    const ABSENT = 'ABSENT';
    const BUSINESS_TRAVEL = 'BUSINESS_TRAVEL';
    const ADD_TIME = 'ADD_TIME';
    const GO_OUT = 'GO_OUT';
    const MATERNITY_LEAVE = 'MATERNITY_LEAVE';

    protected $fillable = [
        'Name', 'Status', 'Type', 'Code',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function absentReason()
    {
        return $this->hasMany(AbsentReason::class, 'Id', 'AbsentTypeId');
    }
}
