<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;

class ChildDescription extends UuidModel
{
    protected $table = 'child_descriptions';

    protected $fillable = [
        'question', 'answer', 'category-child-issue_id', 'child_evaluate_info_id'
    ];

    public function childEvaluateInfo()
    {
        return $this->belongsTo(ChildEvaluateInfo::class, 'child_evaluate_info_id');
    }
}
