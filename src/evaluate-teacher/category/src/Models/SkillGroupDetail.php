<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class SkillGroupDetail extends UuidModel
{
    protected $table = 'evaluate_teacher.SkillGroupDetails';

    protected $fillable = [
        'SkillGroupId', 'Content', 'Code'
    ];

    public function skillGroup()
    {
        return $this->belongsTo(SkillGroup::class, 'SkillGroupId');
    }
}
