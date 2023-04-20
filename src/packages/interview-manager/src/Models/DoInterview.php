<?php

namespace GGPHP\InterviewManager\Models;

use App\Models\User;
use GGPHP\Category\Models\Division;
use GGPHP\Core\Models\UuidModel;

class DoInterview extends UuidModel
{
    CONST CODE = 'PV';
    // chưa phỏng vấn
    // đã phỏng vấn
    // không duyệt lương
    // chờ duyệt
    // không duyệt ứng viên
    // đã duyệt
    // Chưa hoàn thành
    CONST STATUS = [
        'NOT_INTERVIEWED_YET' => 1,
        'INTERVIEWED' => 2,
        'NO_SALARY_APPROVAL' => 3,
        'PENDING' => 4,
        'DO_NOT_APPROVECANDIDATES' => 5,
        'APPROVED' => 6,
        'UNFINISHED' => 7
    ];
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'DoInterviews';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code',
        'InterviewName',
        'CandidateName',
        'Location',
        'DivisionId',
        'File',
        'InterviewConfigurationId',
        'Date',
        'Time',
        'Address',
        'Status',
        'MediumScore',
        'PointEvaluation',
        'InterviewListId',
        'EmployeeId'
    ];

    public function evaluation()
    {
        return $this->belongsToMany(EvaluationCriteria::class, 'DoInterviewEvaluations', 'DoInterviewId', 'EvaluationCriteriaId');
    }

    public function division()
    {
        return $this->belongsTo(Division::class, 'DivisionId');
    }

    public function interviewConfiguration()
    {
        return $this->belongsTo(InterviewConfiguration::class, 'InterviewConfigurationId');
    }
}
