<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class Grade extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Grades';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Note'
    ];

    public function gradeDetail()
    {
        return $this->hasMany(GradeDetail::class, 'GradeId');
    }
}
