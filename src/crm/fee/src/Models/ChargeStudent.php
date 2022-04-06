<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\Category\Models\Branch;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;

class ChargeStudent extends UuidModel
{
    protected $table = 'charge_students';

    protected $fillable = [
        'day_admission', 'mother_phone', 'mother_name', 'father_phone', 'father_name', 'age',
        'date_of_birth', 'name_student', 'student_info_id', 'school_year_id', 'class_type_id', 'total_money', 'status', 'branch_id',
        'expected_to_collect_money'
    ];

    const STATUS = [
        'YET_PAID' => 1,
        'PAID' => 2,
    ];

    protected $casts = [
        'expected_to_collect_money' => 'array'
    ];

    public function studentInfo()
    {
        return $this->belongsTo(StudentInfo::class);
    }

    public function tuition()
    {
        return $this->hasMany(Tuition::class);
    }

    public function admissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class, 'student_info_id', 'student_info_id');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function classType()
    {
        return $this->belongsTo(ClassType::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
