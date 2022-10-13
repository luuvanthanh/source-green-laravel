<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChildEvaluateDetailChildren extends UuidModel
{
    use SoftDeletes;
    protected $table = 'ChildEvaluateDetailChildrens';

    protected $fillable = [
        'Content', 'Use', 'ChildEvaluateDetailId', 'Score'
    ];

    public function childEvaluateDetail()
    {
        return $this->belongsTo(ChildEvaluateDetail::class, 'ChildEvaluateDetailId');
    }
}
