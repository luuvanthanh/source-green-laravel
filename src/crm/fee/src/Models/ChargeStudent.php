<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;

class ChargeStudent extends UuidModel
{
    protected $table = 'charge_students';

    protected $fillable = [
        'day_admission', 'mother_phone', 'mother_name', 'father_phone', 'father_name', 'age',
        'date_of_birth', 'name_student', 'student_info_id', 'school_year_id', 'class_type_id', 'total_money'
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
}
