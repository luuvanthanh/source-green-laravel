<?php

namespace GGPHP\YoungAttendance\Absent\Models;

use GGPHP\Core\Models\UuidModel;

class AbsentReason extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AbsentReasonStudents';

    protected $fillable = [
        'Name', 'AbsentTypeId', 'Status',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentType()
    {
        return $this->belongsTo(AbsentType::class, 'AbsentTypeId');
    }
}
