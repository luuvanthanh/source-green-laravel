<?php

namespace GGPHP\StudyProgram\Setting\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubjectSection extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.SubjectSections';

    protected $fillable = [
        'Name', 'SubjectId'
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'SubjectId');
    }

    public function subjectSectionDetail()
    {
        return $this->hasMany(SubjectSectionDetail::class, 'SubjectSectionId');
    }
}
