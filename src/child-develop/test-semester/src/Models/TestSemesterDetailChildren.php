<?php

namespace GGPHP\ChildDevelop\TestSemester\Models;

use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetail;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetailChildren;
use GGPHP\Core\Models\UuidModel;

class TestSemesterDetailChildren extends UuidModel
{
    protected $table = 'TestSemesterDetailChildrens';

    protected $fillable = [
        'ChildEvaluateDetailId', 'ChildEvaluateDetailChildrenId', 'TestSemesterDetailId', 'ChildEvaluateId', 'Score', 'Age'
    ];

    public function testSemesterDetail()
    {
        return $this->belongsTo(TestSemesterDetail::class, 'TestSemesterDetailId');
    }

    public function childEvaluateDetail()
    {
        return $this->belongsTo(ChildEvaluateDetail::class, 'ChildEvaluateDetailId');
    }

    public function childEvaluateDetailChildren()
    {
        return $this->belongsTo(ChildEvaluateDetailChildren::class, 'ChildEvaluateDetailChildrenId');
    }

    public function childEvaluate()
    {
        return $this->belongsTo(ChildEvaluate::class, 'ChildEvaluateId');
    }
}
