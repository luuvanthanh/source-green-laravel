<?php

namespace GGPHP\Salary\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class Payroll extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Payrolls';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Month', 'IsTimesheet', 'IsBonus', 'IsOther', 'IsSalary', 'ColumnBasicSalaryAndAllowance', 'ColumnIncurredAllowance', 'IsSessionSalary'
    ];

    protected $dateTimeFields = [
        'Date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'Date' => 'datetime',
        // 'ColumnBasicSalaryAndAllowance' => 'array',
        // 'ColumnIncurredAllowance' => 'array'
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function payrollDetail()
    {
        return $this->hasMany(\GGPHP\Salary\Models\PayRollDetail::class, 'PayrollId');
    }

    public function payrollSession()
    {
        return $this->hasMany(PayrollSession::class, 'PayrollId');
    }
}
