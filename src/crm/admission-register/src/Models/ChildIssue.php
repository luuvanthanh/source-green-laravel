<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;

class ChildIssue extends UuidModel
{
    protected $table = 'child_issues';

    protected $fillable = [
        'question', 'is_checked', 'category-question-parent_id', 'child_evaluate_info_id'
    ];
    public function childEvaluateInfo()
    {
        return $this->belongsTo(ChildEvaluateInfo::class, 'child_evaluate_info_id');
    }
}
