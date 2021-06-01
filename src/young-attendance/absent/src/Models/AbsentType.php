<?php

namespace GGPHP\YoungAttendance\Absent\Models;

use GGPHP\Core\Models\UuidModel;

class AbsentType extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AbsentTypeStudents';

    /**
     * Status on,off for absent type
     */
    const ON = 'ON';
    const OFF = 'OFF';
    /**
     * Type of absent
     */
    const ANNUAL_LEAVE = 'ANNUAL_LEAVE';

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
