<?php

namespace GGPHP\Salary\Models;

use GGPHP\Core\Models\UuidModel;

class PayrollSession extends UuidModel
{
    protected $table = 'PayrollSessions';

    protected $fillable = [
        'PayrollId', 'EmployeeId', 'TotalIncome', 'BasicSalary', 'WorkDay', 'Allowance', 'PersonalIncomeTax',
        'TaxPayment', 'SalaryByHour', 'Deduction'
    ];

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'PayrollId');
    }
}
