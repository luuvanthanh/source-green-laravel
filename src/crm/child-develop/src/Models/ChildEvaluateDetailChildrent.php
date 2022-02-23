<?php

namespace GGPHP\Crm\ChildDevelop\Models;

use GGPHP\Core\Models\UuidModel;

class ChildEvaluateDetailChildrent extends UuidModel
{
    protected $table = 'child_evaluate_detail_childrens';

    protected $fillable = [
        'content', 'use', 'child_evaluate_detail_id'
    ];

    public function childEvaluateDetail()
    {
        return $this->belongsTo(ChildEvaluateDetail::class, 'child_evaluate_detail_id');
    }
}
