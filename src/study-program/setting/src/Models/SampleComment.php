<?php

namespace GGPHP\StudyProgram\Setting\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class SampleComment extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.SampleComments';

    const CODE = 'PM';

    protected $fillable = [
        'Name', 'Code'
    ];

    public function sampleCommentDetail()
    {
        return $this->hasMany(SampleCommentDetail::class, 'SampleCommentId');
    }
}
