<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class MedicalInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'medical_infos';

    protected $fillable = [
        'height', 'weight', 'admission_register_id', 'note'
    ];

    public function medicalDeclareInfo()
    {
        return $this->hasMany(MedicalDeclareInfo::class, 'medical_info_id');
    }

    public function childHeathDevelop()
    {
        return $this->hasMany(ChildHeathDevelop::class, 'medical_info_id');
    }

    public function admissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class, 'admission_register_id');
    }
}
