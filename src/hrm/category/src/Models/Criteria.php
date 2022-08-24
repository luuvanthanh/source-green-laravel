<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class Criteria extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Criterias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function criteriaDetail()
    {
        return $this->hasMany(CriteriaDetail::class, 'CriteriaId');
    }
}
