<?php

namespace GGPHP\Profile\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class HealthInsurance extends UuidModel
{
    //use ActivityLogTrait;
    protected $table = 'HealthInsurances';

    protected $fillable = [
        'InsuranceNumber', 'MedicalTreatmentPlace', 'EmployeeId', 'HospitalCode'
    ];

    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
