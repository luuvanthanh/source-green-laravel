<?php

namespace GGPHP\Crm\Config\Models;

use GGPHP\Core\Models\UuidModel;

class ConfigMedicalDeclareDetail extends UuidModel
{
    protected $table = 'config_medical_declare_details';

    protected $fillable = [
        'name', 'config_madical_declare_id',
    ];

    public function configMedicalDeclare()
    {
        return $this->belongsTo(ConfigMedicalDeclare::class, 'config_madical_declare_id');
    }
}
