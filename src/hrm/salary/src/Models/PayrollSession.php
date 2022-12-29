<?php

namespace GGPHP\Salary\Models;

use GGPHP\Core\Models\UuidModel;

class PayrollSession extends UuidModel
{
    protected $table = 'PayrollSessions';

    protected $fillable = [
        'PayrollId', 'EmployeeId', 'TotalIncome', 'BasicSalary', 'WorkDay', 'Allowance', 'PersonalIncomeTax',
        'TaxPayment', 'ValueSalary', 'Deduction'
    ];

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'PayrollId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
