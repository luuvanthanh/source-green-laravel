<?php

namespace GGPHP\Salary\Models;

use GGPHP\Core\Models\UuidModel;

class Payroll extends UuidModel
{
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
        'Month', 'IsTimesheet', 'IsBonus', 'IsOther', 'IsSalary', 'ColumnBasicSalaryAndAllowance', 'ColumnIncurredAllowance',
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
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function payrollDetail()
    {
        return $this->hasMany(\GGPHP\Salary\Models\PayRollDetail::class, 'PayrollId');
    }
}
