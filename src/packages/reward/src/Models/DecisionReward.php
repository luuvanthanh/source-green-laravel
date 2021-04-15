<?php

namespace GGPHP\Reward\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class DecisionReward extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'decision_rewards';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'decision_number', 'decision_date', 'reason', 'type',
    ];

    protected $dateTimeFields = [
        'decision_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'decision_date' => 'datetime',
    ];

    /**
     * Get educations of employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function decisionRewardDetails()
    {
        return $this->hasMany(DecisionRewardDetail::class, 'decision_reward_id');
    }

    /**
     * Define relations employee
     */
    public function employeeCreate()
    {
        return $this->belongsTo(User::class, 'employee_create');
    }

}
