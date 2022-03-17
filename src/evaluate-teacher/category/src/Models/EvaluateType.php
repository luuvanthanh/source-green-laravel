<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class EvaluateType extends UuidModel
{
    protected $table = 'evaluate-teacher.EvaluateTypes';

    protected $fillable = [
        'Code', 'Name', 'SelfEvaluate', 'Description', 'FileImage'
    ];

    public function skillGroup()
    {
        return $this->belongsToMany(SkillGroup::class, 'evaluate-teacher.EvaluateTypeSkillGroups', 'EvaluateTypeId', 'SkillGroupId');
    }

    public function evaluateTypeDetail()
    {
        return $this->hasMany(EvaluateTypeDetail::class, 'EvaluateTypeId');
    }
}
