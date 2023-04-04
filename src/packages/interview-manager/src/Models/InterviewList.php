<?php

namespace GGPHP\InterviewManager\Models;

use App\Models\User;
use GGPHP\Category\Models\Division;
use GGPHP\Core\Models\UuidModel;

class InterviewList extends UuidModel
{
    CONST CODE = 'PV';
    // chưa phỏng vấn
    // đã phỏng vấn
    // không duyệt lương
    // chờ duyệt
    // không duyệt ứng viên
    // đã duyệt
    CONST STATUS = [
        'NOT_INTERVIEWED_YET' => 1,
        'INTERVIEWED' => 2,
        'NO_SALARY_APPROVAL' => 3,
        'PENDING' => 4,
        'DO_NOT_APPROVECANDIDATES' => 5,
        'APPROVED' => 6
    ];
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'InterviewLists';

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
        'Result',
        'SuggestedSalary'
    ];

    public function interviewListEmployee()
    {
        return $this->belongsToMany(User::class, 'InterviewListEmployees', 'InterviewListId', 'EmployeeId');
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
