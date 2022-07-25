<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class Block extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Blocks';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Note', 'GradeId'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function grade()
    {
        return $this->belongsTo(Grade::class, 'GradeId');
    }
}
