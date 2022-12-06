<?php

namespace GGPHP\ChildDevelop\TestSemester\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\ChildDevelop\Category\Models\CategorySkill;
use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestSemesterDetail extends UuidModel
{
    use ActivityLogTrait;
    use SoftDeletes;
    
    protected $table = 'TestSemesterDetails';

    protected $fillable = [
        'CategorySkillId', 'TestSemesterId', 'Status', 'SerialNumber', 'TotalScore'
    ];

    const STATUS = [
        'DRAFT' => 0,
        'FINISH' => 1,
    ];

    public function testSemester()
    {
        return $this->belongsTo(TestSemester::class, 'TestSemesterId');
    }

    public function testSemesterDetailChildren()
    {
        return $this->hasMany(TestSemesterDetailChildren::class, 'TestSemesterDetailId');
    }

    public function categorySkill()
    {
        return $this->belongsTo(CategorySkill::class, 'CategorySkillId');
    }
}
