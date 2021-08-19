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
    protected $table = 'SalaryIncreases';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DecisionNumber', 'DecisionDate', 'Reason', 'EmployeeId', 'TimeApply', 'Note',
        'TotalAllowance', 'BasicSalary', 'OldBasicSalary'
    ];

    protected $dateTimeFields = [
        'DecisionDate',
        'TimeApply',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'DecisionDate' => 'datetime',
        'TimeApply' => 'datetime',
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
        return $this->belongsTo(User::class, 'EmployeeId');
    }

    /**
     * Define relations employee
     */
    public function parameterValues()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterValue::class, 'SalaryIncreaseParameterValue', 'SalaryIncreaseId', 'ParameterValueId')->withPivot('Value');
    }
}
