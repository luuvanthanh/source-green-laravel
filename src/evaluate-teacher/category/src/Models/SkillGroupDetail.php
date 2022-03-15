<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class SkillGroupDetail extends UuidModel
{
    protected $table = 'evaluate-teacher.SkillGroupDetails';

    protected $fillable = [
        'SkillGroupId', 'Content'
    ];

    public function skillGroup()
    {
        return $this->belongsTo(SkillGroup::class, 'SkillGroupId');
    }
}
