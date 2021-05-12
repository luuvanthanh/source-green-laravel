<?php

namespace GGPHP\Absent\Models;

use GGPHP\Core\Models\UuidModel;

class AbsentDetail extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AbsentDetails';

    protected $fillable = [
        'AbsentId', 'Date', 'IsFullDate', 'ShiftCode', 'StartTime', 'EndTime',
    ];

    protected $dateTimeFields = [
        'Date',
    ];

    protected $casts = [
        'Date' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absent()
    {
        return $this->belongsTo(Absent::class, 'AbsentId');
    }

}
