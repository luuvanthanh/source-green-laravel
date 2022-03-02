<?php

namespace GGPHP\ResignationDecision\Models;

use GGPHP\Core\Models\UuidModel;

class ResignationDecision extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ResignationDecisions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DecisionNumber', 'DecisionDate', 'Reason', 'EmployeeId', 'TimeApply', 'PayEndDate', 'Note','File'
    ];

    protected $dateTimeFields = [
        'DecisionDate',
        'TimeApply',
        'PayEndDate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'DecisionDate' => 'datetime',
        'TimeApply' => 'datetime',
        'PayEndDate' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
