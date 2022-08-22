<?php

namespace GGPHP\Salary\Models;

use GGPHP\Core\Models\UuidModel;

class PayRollDetail extends UuidModel
{
    public $incrementing = false;

    const LUONG_CB = 'LUONG_CB';
    const PC = [
        'PC_TRACH_NHIEM' => 'PC_TRACH_NHIEM',
        'PC_XANG_XEPC_DONG_PHUCPC_CHUYEN_CAN' => 'PC_XANG_XEPC_DONG_PHUCPC_CHUYEN_CAN',
        'PC_AN_TRUA' => 'PC_AN_TRUA',
        'PC_DIEN_THOAI' => 'PC_DIEN_THOAI',
        'PC_LEAD_LOP_HOC' => 'PC_LEAD_LOP_HOC',
        'PC_KHAC' => 'PC_KHAC',
        'PC_HT_TCSK' => 'PC_HT_TCSK',
        'PC_NANG_SUAT' => 'PC_NANG_SUAT',
        'PC_PHAT_SINH' => 'PC_PHAT_SINH',
        'PC_BUS' => 'PC_BUS',
        'PC_THEOHD' => 'PC_THEOHD'
    ];

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
        'BasicSalaryAndAllowance' => 'array',
        'IncurredAllowance' => 'array'
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
