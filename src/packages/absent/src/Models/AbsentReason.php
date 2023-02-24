<?php

namespace GGPHP\Absent\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class AbsentReason extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    protected $table = 'AbsentReasons';

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
