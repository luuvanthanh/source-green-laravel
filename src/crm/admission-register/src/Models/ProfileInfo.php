<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Config\Models\ConfigProfileInfo;

class ProfileInfo extends UuidModel
{
    protected $table = 'profile_infos';

    protected $fillable = [
        'config_profile_info_id', 'status', 'file_image', 'admission_register_id'
    ];

    public function admissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class, 'admission_register_id');
    }

    public function configProfileInfo()
    {
        return $this->belongsTo(ConfigProfileInfo::class, 'config_profile_info_id');
    }
}
