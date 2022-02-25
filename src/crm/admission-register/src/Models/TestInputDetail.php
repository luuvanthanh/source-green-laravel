<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\ChildDevelop\Models\CategorySkill;

class TestInputDetail extends UuidModel
{
    protected $table = 'test_input_details';

    protected $fillable = [
        'test_input_id', 'category_skill_id', 'status', 'serial_number'
    ];

    const STATUS = [
        'DRAFT' => 0,
        'FINISH' => 1,
    ];

    public function testInputDetailChildren()
    {
        return $this->hasMany(TestInputDetailChildren::class, 'test_input_detail_id');
    }

    public function testInput()
    {
        return $this->belongsTo(TestInput::class, 'test_input_id');
    }

    public function categorySkill()
    {
        return $this->belongsTo(CategorySkill::class, 'category_skill_id');
    }
}
