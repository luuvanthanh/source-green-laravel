<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Models;

use GGPHP\Core\Models\UuidModel;

class ChildEvaluateDetailChildren extends UuidModel
{
    protected $table = 'ChildEvaluateDetailChildrens';

    protected $fillable = [
        'Content', 'Use', 'ChildEvaluateDetailId'
    ];

    public function childEvaluateDetail()
    {
        return $this->belongsTo(ChildEvaluateDetail::class, 'ChildEvaluateDetailId');
    }
}
