<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TypeTeacher extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'TypeTeachers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'DescriptionJob', 'TypeOfContractId', 'Policy', 'WorkExperience', 'AvaluateFrom', 'AvaluateTo', 'Experience'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
