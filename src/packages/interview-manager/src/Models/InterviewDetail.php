<?php

namespace GGPHP\InterviewManager\Models;

use App\Models\User;
use GGPHP\Category\Models\Division;
use GGPHP\Core\Models\UuidModel;

class InterviewDetail extends UuidModel
{
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'InterviewDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      'InterviewListId',
      'PointEvaluation',
      'Comment'
    ];
}
