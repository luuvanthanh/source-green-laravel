<?php

namespace GGPHP\Reward\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class Reward extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Rewards';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'DecisionNumber', 'DecisionDate', 'Reason', 'Type', 'Money', 'TimeApply', 'Note',
    ];

    protected $dateTimeFields = [
        'DecisionDate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'DecisionDate' => 'datetime',
    ];

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }
}
