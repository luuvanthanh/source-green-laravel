<?php

namespace GGPHP\StudyProgram\Setting\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubjectSectionDetail extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.SubjectSectionDetails';

    protected $fillable = [
        'Name', 'SubjectSectionId'
    ];

    public function subjectSection()
    {
        return $this->belongsTo(SubjectSection::class, 'SubjectSectionId');
    }
}
