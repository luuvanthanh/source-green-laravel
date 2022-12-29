<?php

namespace GGPHP\Clover\Models;

use Illuminate\Database\Eloquent\Model;

class ClassProjectSession extends Model
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'distribution.ClassProjectSessions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ProgramName', 'SessionName', 'LessonName', 'ClassProjectId', 'TeachingShiftId'
    ];
}
