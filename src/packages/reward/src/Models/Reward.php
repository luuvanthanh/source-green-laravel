<?php

namespace GGPHP\Reward\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class Reward extends UuidModel
{
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'employee_id', 'decision_number', 'decision_date', 'reason', 'type', 'money', 'time_apply', 'note',
    ];

    protected $dateTimeFields = [
        'date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'date' => 'datetime',
    ];

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
