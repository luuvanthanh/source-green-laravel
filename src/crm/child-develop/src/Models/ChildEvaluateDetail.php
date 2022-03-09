<?php

namespace GGPHP\Crm\ChildDevelop\Models;

use GGPHP\Core\Models\UuidModel;

class ChildEvaluateDetail extends UuidModel
{
    protected $table = 'child_evaluate_details';

    protected $fillable = [
        'name_criteria', 'input_assessment', 'periodic_assessment', 'use', 'child_evaluate_id', 'child_evaluate_detail_clover_id'
    ];

    public function childEvaluate()
    {
        return $this->belongsTo(ChildEvaluate::class, 'child_evaluate_id');
    }

    public function childEvaluateDetailChildrent()
    {
        return $this->hasMany(ChildEvaluateDetailChildrent::class, 'child_evaluate_detail_id');
    }
}
