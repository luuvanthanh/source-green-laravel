<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\StatusAdmissionRegister;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdmissionRegister extends UuidModel
{
    use SoftDeletes;

    protected $table = 'admission_registers';

    protected $fillable = [
        'student_info_id', 'address', 'date_register', 'parent_wish', 'children_note', 'status_admission_register_id', 'branch_id', 'school_year_id', 'status'
    ];

    public function studentInfo()
    {
        return $this->belongsTo(StudentInfo::class, 'student_info_id');
    }

    public function parentInfo()
    {
        return $this->hasMany(ParentInfo::class, 'admission_register_id');
    }

    public function statusAdmissionRegister()
    {
        return $this->belongsTo(StatusAdmissionRegister::class, 'status_admission_register_id');
    }

    public function confirmTransporter()
    {
        return $this->hasMany(ConfirmTransporter::class);
    }

    public function testInput()
    {
        return $this->hasOne(TestInput::class);
    }

    public function medicalInfo()
    {
        return $this->hasOne(MedicalInfo::class, 'admission_register_id');
    }

    public function profileInfo()
    {
        return $this->hasMany(ProfileInfo::class, 'admission_register_id');
    }
}
