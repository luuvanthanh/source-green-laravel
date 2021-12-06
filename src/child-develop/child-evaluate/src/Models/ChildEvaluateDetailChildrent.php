<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Models;

use GGPHP\Core\Models\UuidModel;

class ChildEvaluateDetailChildrent extends UuidModel
{
    protected $table = 'ChildEvaluateDetailChildrents';

    protected $fillable = [
        'Content', 'Use', 'ChildEvaluateDetailId'
    ];

    public function childEvaluateDetail()
    {
        return $this->belongsTo(ChildEvaluateDetail::class, 'ChildEvaluateDetailId');
    }
}
