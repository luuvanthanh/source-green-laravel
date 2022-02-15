<?php

namespace GGPHP\Tariff\PaymentPlan\Models;

use GGPHP\Category\Models\Branch;
use GGPHP\Clover\Models\Classes;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\ClassType;
use GGPHP\Fee\Models\SchoolYear;

class PaymentPlan extends UuidModel
{
    protected $table = 'fee.PaymentPlans';

    protected $fillable = [
        'DatePlan', 'ChargeMonth', 'SchoolYearId', 'BranchId', 'ClassId', 'ClassTypeId'
    ];

    protected $casts = [
        'DatePlan' => 'date:Y-m-d',
        'ChargeMonth' => 'date:Y-m-d'
    ];

    public function paymentPlanDetail()
    {
        return $this->hasMany(PaymentPlanDetail::class, 'PaymentPlanId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'BranchId');
    }

    public function classes()
    {
        return $this->belongsTo(Classes::class, 'ClassId');
    }

    public function classType()
    {
        return $this->belongsTo(ClassType::class, 'ClassTypeId');
    }
}
