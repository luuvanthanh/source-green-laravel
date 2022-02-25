<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\Category\Models\CategoryRelationship;
use GGPHP\Crm\Fee\Models\ChargeStudent;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'student_infos';

    const SEX = [
        'FEMALE' => 0,
        'MALE' => 1,
        'OTHER' => 2,
    ];

    protected $fillable = [
        'full_name', 'birth_date', 'sex',
        'customer_lead_id', 'file_image', 'category_relationship_id'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }

    public function categoryRelationship()
    {
        return $this->belongsTo(CategoryRelationship::class);
    }

    public function admissionRegister()
    {
        return $this->hasMany(AdmissionRegister::class, 'student_info_id');
    }

    public function chargeStudent()
    {
        return $this->hasMany(ChargeStudent::class);
    }
}
