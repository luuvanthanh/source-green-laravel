<?php

namespace GGPHP\Absent\Models;

use GGPHP\Core\Models\UuidModel;

class AbsentReason extends UuidModel
{
    public $incrementing = false;

    protected $fillable = [
        'name', 'absent_type_id', 'status',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentType()
    {
        return $this->belongsTo(AbsentType::class);
    }
}
