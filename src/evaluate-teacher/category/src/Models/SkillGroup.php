<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class SkillGroup extends UuidModel
{
    protected $table = 'evaluate-teacher.SkillGroups';

    protected $fillable = [
        'Code', 'Name', 'Description'
    ];

    public function skillGroupDetail()
    {
        return $this->hasMany(SkillGroupDetail::class, 'SkillGroupId');
    }
}
