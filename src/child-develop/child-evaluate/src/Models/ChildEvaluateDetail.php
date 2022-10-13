<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChildEvaluateDetail extends UuidModel
{
    use SoftDeletes;
    const TOTAL_SCORE = 10;

    protected $table = 'ChildEvaluateDetails';

    protected $fillable = [
        'NameCriteria', 'InputAssessment', 'PeriodicAssessment', 'Use', 'ChildEvaluateId', 'TotalScore'
    ];

    public function childEvaluate()
    {
        return $this->belongsTo(ChildEvaluate::class, 'ChildEvaluateId');
    }

    public function childEvaluateDetailChildren()
    {
        return $this->hasMany(ChildEvaluateDetailChildren::class, 'ChildEvaluateDetailId');
    }
}
