<?php

namespace GGPHP\DecisionSuspend\Models;

use GGPHP\Core\Models\UuidModel;

class DecisionSuspend extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'decision_suspends';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'decision_number', 'decision_date', 'reason', 'employee_id', 'from', 'to', 'note',
    ];

    protected $dateTimeFields = [
        'decision_date',
        'from',
        'to',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'decision_date' => 'datetime',
        'from' => 'datetime',
        'to' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'employee_id');
    }

}
