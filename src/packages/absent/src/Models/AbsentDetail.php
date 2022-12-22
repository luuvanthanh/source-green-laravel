<?php

namespace GGPHP\Absent\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class AbsentDetail extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    protected $table = 'AbsentDetails';

    protected $fillable = [
        'AbsentId', 'Date', 'IsFullDate', 'ShiftCode', 'StartTime', 'EndTime', 'ShiftId',
    ];

    protected $casts = [
        'Date' => 'date:Y-m-d',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absent()
    {
        return $this->belongsTo(Absent::class, 'AbsentId');
    }
}
