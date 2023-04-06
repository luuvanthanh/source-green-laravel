<?php

namespace GGPHP\InterviewManager\Models;

use App\Models\User;
use GGPHP\InterviewManager\Models\PointEvaluation;
use GGPHP\Core\Models\UuidModel;

class InterviewDetail extends UuidModel
{
  const STATUS = [
    'HAVE_EVALUATED' => 1,
    'NOT_YET_RATED' => 2
  ];
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
    'Comment',
    'EmployeeId',
    'Status',
    'AverageScoreAsAssessedByStaff',
    'PointEvaluationId'
  ];

  public function pointEvaluation()
  {
    return $this->belongsTo(PointEvaluation::class, 'PointEvaluationId');
  }
}
