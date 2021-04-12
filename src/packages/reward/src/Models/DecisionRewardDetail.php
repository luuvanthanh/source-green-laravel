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
    protected $table = 'decision_reward_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'decision_reward_id', 'employee_id', 'money', 'time_apply', 'note',
    ];

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
