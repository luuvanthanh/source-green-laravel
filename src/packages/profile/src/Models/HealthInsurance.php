<?php

namespace GGPHP\Profile\Models;

use GGPHP\Core\Models\UuidModel;

class HealthInsurance extends UuidModel
{
    protected $table = 'HealthInsurances';

    protected $fillable = [
        'InsuranceNumber', 'MedicalTreatmentPlace', 'EmployeeId'
    ];

    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
