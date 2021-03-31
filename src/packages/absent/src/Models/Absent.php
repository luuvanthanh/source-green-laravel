<?php

namespace GGPHP\Absent\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class Absent extends UuidModel
{
    public $incrementing = false;

    protected $fillable = [
        'absent_type_id', 'absent_reason_id', 'user_id', 'start_date', 'end_date',
    ];

    protected $dateTimeFields = [
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentType()
    {
        return $this->belongsTo(AbsentType::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentReason()
    {
        return $this->belongsTo(AbsentReason::class);
    }
}
