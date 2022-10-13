<?php

namespace GGPHP\ChildDevelop\TestSemester\Models;

use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetail;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetailChildren;
use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestSemesterDetailChildren extends UuidModel
{
    use SoftDeletes;

    protected $table = 'TestSemesterDetailChildrens';

    const STATUS = [
        'CHECKED' => 1,
        'UNCHECK' => 2
    ];

    protected $fillable = [
        'ChildEvaluateDetailId', 'ChildEvaluateDetailChildrenId', 'TestSemesterDetailId', 'ChildEvaluateId', 'Score', 'Age', 'Status'
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
