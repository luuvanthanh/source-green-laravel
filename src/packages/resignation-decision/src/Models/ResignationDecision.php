<?php

namespace GGPHP\ResignationDecision\Models;

use GGPHP\Core\Models\UuidModel;

class ResignationDecision extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'resignation_decisions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'decision_number', 'decision_date', 'reason', 'employee_id', 'time_apply', 'pay_end_date', 'note',
    ];

    protected $dateTimeFields = [
        'decision_date',
        'time_apply',
        'pay_end_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'decision_date' => 'datetime',
        'time_apply' => 'datetime',
        'pay_end_date' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'employee_id');
    }

}
