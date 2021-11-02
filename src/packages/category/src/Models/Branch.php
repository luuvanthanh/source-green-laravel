<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends UuidModel
{
    use SoftDeletes;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Branches';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Address', 'PhoneNumber', 'BranchIdCrm'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
