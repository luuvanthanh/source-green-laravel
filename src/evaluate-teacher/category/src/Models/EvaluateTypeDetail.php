<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class EvaluateTypeDetail extends UuidModel
{
    protected $table = 'evaluate-teacher.EvaluateTypeDetails';

    protected $fillable = [
        'EvaluateTypeId', 'SkillGroupDetailId'
    ];

    public function ratingLevel()
    {
        return $this->belongsToMany(RatingLevel::class, 'evaluate-teacher.EvaluateTypeDetailRatingLevels', 'EvaluateTypeDetailId', 'RatingLevelId');
    }

    public function evaluateType()
    {
        return $this->belongsTo(EvaluateType::class, 'EvaluateTypeId');
    }

    public function skillGroupDetail()
    {
        return $this->belongsTo(SkillGroupDetail::class, 'SkillGroupDetailId');
    }
}
