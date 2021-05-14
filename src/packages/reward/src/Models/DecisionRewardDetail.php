<?php

namespace GGPHP\Reward\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class DecisionRewardDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'DecisionRewardDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DecisionRewardId', 'EmployeeId', 'Money', 'TimeApply', 'Note',
    ];

    protected $dateTimeFields = [
        'TimeApply',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'TimeApply' => 'datetime',
    ];

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }
}
