<?php

namespace GGPHP\DecisionSuspend\Models;

use GGPHP\Core\Models\UuidModel;

class DecisionSuspend extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'DecisionSuspends';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DecisionNumber', 'DecisionDate', 'Reason', 'EmployeeId', 'From', 'To', 'Note',
    ];

    protected $dateTimeFields = [
        'DecisionDate',
        'From',
        'To',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'DecisionDate' => 'datetime',
        'From' => 'datetime',
        'To' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

}
