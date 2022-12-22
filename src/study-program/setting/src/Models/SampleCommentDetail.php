<?php

namespace GGPHP\StudyProgram\Setting\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class SampleCommentDetail extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.SampleCommentDetails';

    protected $fillable = [
        'Name', 'SampleCommentId'
    ];
}
