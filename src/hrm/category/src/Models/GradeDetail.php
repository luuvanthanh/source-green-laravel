<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class GradeDetail extends UuidModel
{
    public $incrementing = false;

    const LEVEL = [
        'FIRST' => 1,
        'SECOND' => 2,
        'THIRD' => 3,
        'FOURTH' => 4,
        'FIFTH' => 5,
    ];

    /**
     * Declare the table name
     */
    protected $table = 'GradeDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'CriteriaId', 'Level', 'Description', 'GradeId'
    ];

    public function grade()
    {
        return $this->belongsTo(Grade::class, 'GradeId');
    }

    public function criteria()
    {
        return $this->belongsTo(Criteria::class, 'CriteriaId');
    }
}
