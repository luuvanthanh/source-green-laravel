<?php

namespace GGPHP\TeacherAssignment\Models;

use GGPHP\Category\Models\Branch;
use GGPHP\Clover\Models\Classes;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class TeacherAssignment extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'TeacherAssignments';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'DecisionNumber', 'DecisionDate', 'TimeApply', 'BranchId', 'ClassesId', 'Note', 'FileImage'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'DateDecision' => 'datetime',
        'DateApply' => 'datetime'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'BranchId');
    }

    public function classes()
    {
        return $this->belongsTo(Classes::class, 'ClassesId');
    }
}
