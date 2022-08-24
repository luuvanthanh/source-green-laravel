<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class CriteriaDetail extends UuidModel
{
    const LEVEL = [
        'FIRST' => 1,
        'SECOND' => 2,
        'THIRD' => 3,
        'FOURTH' => 4,
        'FIFTH' => 5,
    ];
    
    protected $table = 'CriteriaDetails';

    protected $fillable = [
        'Level', 'Define', 'SpecificExpression', 'CriteriaId'
    ];

    public function criteria()
    {
        return $this->belongsTo(Criteria::class, 'CriteriaId');
    }
}
