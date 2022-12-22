<?php

namespace GGPHP\StudyProgram\Setting\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.Subjects';

    const CODE = 'PM';

    protected $fillable = [
        'Name', 'Code'
    ];

    public function subjectSection()
    {
        return $this->hasMany(SubjectSection::class, 'SubjectId');
    }
}
