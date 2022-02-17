<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Config\Models\ConfigMedicalDeclare;

class MedicalDeclareInfo extends UuidModel
{
    protected $table = 'medical_declare_infos';

    protected $fillable = [
        'is_checked', 'reason', 'config_medical_declare_id', 'medical_info_id'
    ];

    public function medicalInfo()
    {
        return $this->belongsTo(MedicalInfo::class, 'medical_info_id');
    }

    public function configMedicalDeclare()
    {
        return $this->belongsTo(ConfigMedicalDeclare::class, 'config_medical_declare_id');
    }
}
