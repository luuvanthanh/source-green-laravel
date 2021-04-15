<?php

namespace GGPHP\SalaryIncrease\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class SalaryIncrease extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'salary_increases';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'decision_number', 'decision_date', 'reason', 'employee_id', 'time_apply', 'note',
    ];

    protected $dateTimeFields = [
        'decision_date',
        'time_apply',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'decision_date' => 'datetime',
        'time_apply' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    /**
     * Define relations employee
     */
    public function parameterValues()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterValue::class, 'salary_increase_parameter_value', 'salary_increase_id', 'parameter_value_id')->withPivot('value');
    }

}
