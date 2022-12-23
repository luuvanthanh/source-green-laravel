<?php

namespace GGPHP\Salary\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class PayRollDetail extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'PayrollDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'PayrollId', 'EmployeeId', 'DateStartWork', 'IsProbation', 'IsMaternity', 'IsSocialInsurance', 'BasicSalaryAndAllowance', 'IncurredAllowance',
        'TotalIncome', 'KpiBonus', 'OtTax', 'OtNoTax', 'UnpaidLeave', 'TotalWork', 'TotalIncomeMonth', 'SocialInsuranceEmployee',
        'SocialInsuranceAdjustedEmployee', 'SocialInsuranceCompany', 'SocialInsuranceAdjustedCompany', 'HealthInsuranceEmployee', 'HealthInsuranceCompany',
        'UnemploymentInsuranceEmployee', 'UnemploymentInsuranceCompany', 'UnionDues', 'DependentPerson', 'Eeduce', 'Charity', 'TotalReduce', 'RentalIncome',
        'PersonalIncomeTax', 'SocialInsurancePayment', 'Advance', 'ActuallyReceived', 'Note', 'SalaryByHour', 'OtWeekday', 'OtWeekend', 'OtHoliday', 'BusAllowance', 'TotalBusRegistration'
    ];

    protected $dateTimeFields = [];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        // 'BasicSalaryAndAllowance' => 'array',
        // 'IncurredAllowance' => 'array'
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'PayrollId');
    }
}
