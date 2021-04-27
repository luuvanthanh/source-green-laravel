<?php

namespace GGPHP\Reward\Models;

use GGPHP\Core\Models\UuidModel;

class DecisionReward extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'DecisionRewards';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DecisionNumber', 'DecisionDate', 'Reason', 'Type',
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
     * Get educations of employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function decisionRewardDetails()
    {
        return $this->hasMany(DecisionRewardDetail::class, 'DecisionRewardId');
    }

}
