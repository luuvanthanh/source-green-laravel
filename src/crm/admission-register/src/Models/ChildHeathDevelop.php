<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;

class ChildHeathDevelop extends UuidModel
{
    protected $table = 'child_heath_develops';

    protected $fillable = [
        'sick', 'year', 'hospital_time', 'status', 'medical_info_id', 'note'
    ];

    public function medicalInfo()
    {
        return $this->belongsTo(MedicalInfo::class, 'medical_info_id');
    }
}
