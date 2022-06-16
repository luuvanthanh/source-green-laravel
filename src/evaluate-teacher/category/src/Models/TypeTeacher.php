<?php

namespace GGPHP\EvaluateTeacher\Category\Models;

use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Core\Models\UuidModel;

class TypeTeacher extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.TypeTeachers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'DescriptionJob', 'TypeOfContractId', 'Policy', 'WorkExperience', 'RatingLevelFrom', 'RatingLevelTo', 'Experience'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function ratingLevelFrom()
    {
        return $this->belongsTo(RatingLevel::class, 'RatingLevelFrom');
    }

    public function ratingLevelTo()
    {
        return $this->belongsTo(RatingLevel::class, 'RatingLevelTo');
    }

    public function typeOfContract()
    {
        return $this->belongsTo(TypeOfContract::class, 'TypeOfContractId');
    }
}
