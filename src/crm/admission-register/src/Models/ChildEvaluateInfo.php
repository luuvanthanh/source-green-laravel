<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;

class ChildEvaluateInfo extends UuidModel
{
    protected $table = 'child_evaluate_infos';

    protected $fillable = [
        'other_issue', 'parent_hope', 'admission_register_id'
    ];

    public function admissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class, 'admission_register_id');
    }

    public function childDescription()
    {
        return $this->hasMany(ChildDescription::class, 'child_evaluate_info_id');
    }

    public function childIssue()
    {
        return $this->hasMany(ChildIssue::class, 'child_evaluate_info_id');
    }
}
