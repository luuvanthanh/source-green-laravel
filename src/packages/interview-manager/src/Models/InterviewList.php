<?php

namespace GGPHP\InterviewManager\Models;

use App\Models\User;
use GGPHP\Category\Models\Division;
use GGPHP\Core\Models\UuidModel;

class InterviewList extends UuidModel
{
    CONST CODE = 'NPV';
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

    public function interviewerEmployee()
    {
        return $this->belongsToMany(User::class, 'InterviewerEmployees', 'InterviewerId', 'EmployeeId');
    }

    public function division()
    {
        return $this->belongsTo(Division::class, 'DivisionId');
    }
}
